import { DuckDBInstance } from '@duckdb/node-api';

import { PROFILE_LIST, MULTI_PROFILES, dateRounding, gameSort } from './constants.js';
import { PROFILES_SCHEMA_FIELDS, PROFILES_CREATETABLE_SQL_STATEMENT, PROFILES_INSERT_SQL_STATEMENT, PROFILES_INSERT_BIND_FUN } from './db_definitions/profile.js';
import { MATCHES_SCHEMA_FIELDS , MATCHES_CREATETABLE_SQL_STATEMENT , MATCHES_INSERT_SQL_STATEMENT , MATCHES_INSERT_BIND_FUN  } from './db_definitions/match.js';
import { fetchProfiles, fetchMatches } from './fetches.js';

// Duck DB path
const DB_PATH = '.observable/data/cs2teamdedication.duckdb'

async function main() {

    // Connecting to db
    const instance = await DuckDBInstance.create(DB_PATH);
    const conn = await instance.connect();

    ////
    // PROFILES RETRIEVAL
    ////

    // Fetching profiles data
    let profiles = [];
    try {
        // Collecting profile info
        profiles = await fetchProfiles(PROFILE_LIST.map(p => p.id));
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }

    // TINY HACK: for retrieving the matches, we need to know if the profile is a Leetify user, so let's add that to the raw_json
    // Reason: match_ids are only retrievable when it is such an user
    profiles = profiles.map((p) =>({
        ...p,
        isLeetifyUser: p.personalBestsCs2 != null,
    }))

    const leetifyUsersProfiles = profiles.filter(f => f.isLeetifyUser);
    const nonLeetifyUsersProfiles = profiles.filter(f => !f.isLeetifyUser);

    // Retrieving all unique matches played from Leetify profiles (we'll get the diff from DB and retrieve them online)
    const allPlayedMatches = [...new Set(
                                leetifyUsersProfiles
                                .map(p => p.games)
                                .flat()
                                .map(g => g.gameId)
                              )];

    ////
    // MATCHES
    ////
    // Creating table if doesn't exist
    try {
        await conn.run(MATCHES_CREATETABLE_SQL_STATEMENT);
    } catch (error) {
        console.error('Error creating matches table', error);
    }

    // Updating table schema (if changed)
    try {
        let matchesCurrentColumns = [];
        const result = await conn.run('select distinct column_name from (describe matches)');
        const rows = await result.getRows();
        matchesCurrentColumns = rows.map(r => r[0]);
    
        const missingColumns = MATCHES_SCHEMA_FIELDS.filter(f => !matchesCurrentColumns.includes(f.name));
        const columnsToDelete = matchesCurrentColumns.filter(f => !MATCHES_SCHEMA_FIELDS.map(s => s.name).includes(f));

        // console.log({matchesCurrentColumns, missingColumns, columnsToDelete})
    
        for (const column of missingColumns) {
            // First adding the column
            await conn.run(`ALTER TABLE matches ADD COLUMN ${column.name} ${column.type};`)

            // Now populating it
            const raw_matches_result = await conn.run(`select match_id, raw_json from matches;`);
            const raw_matches_rows = await raw_matches_result.getRowObjectsJS();
            const matches = raw_matches_rows.map(({match_id, raw_json}) => ({match_id, json: JSON.parse(raw_json)}));

            const stmt = await conn.prepare(`UPDATE matches SET ${column.name} = $column_value WHERE match_id = $match_id`);
            for (const {match_id, json} of matches) {
                const matchUpdateFieldBinds = {
                    column_value: column.ac_fun(json),
                    match_id
                }
                stmt.bind(matchUpdateFieldBinds);
                await stmt.run();
            }
            console.log(`Added and updated ${matches.length} rows with ${column.name}`);

        }
        for (const column_name of columnsToDelete) {
            await conn.run(`ALTER TABLE matches DROP COLUMN ${column_name};`)
            console.log("Removed column:", column_name);
        }

    } catch (error) {
        console.error('Error updating matches table schema', error);
    }

    // Retrieving saved matches
    let savedMatchIds = [];
    let savedMatchRawJSONs = [];
    try {
        const result = await conn.run('SELECT distinct match_id, raw_json FROM matches');
        const rows = await result.getRows();
        savedMatchIds = rows.map(r => r[0]);
        savedMatchRawJSONs = rows.map(r => JSON.parse(r[1]));
    } catch (error) {
        console.error('Error retrieving saved matches ids', error);
    }
    // console.log({savedMatchIds, savedMatchRawJSONs});

    // Calculating the matches we have yet to retrieve
    const matchesToRetrieve = allPlayedMatches
                                    .filter(f => !savedMatchIds.includes(f))
                                    // .slice(0,10)
    // console.log({matchesToRetrieve});

    // // Fetching matches
    let retrievedMatches = [];
    try {
        // Collecting profile info
        retrievedMatches = await fetchMatches(matchesToRetrieve);
    } catch (error) {
        console.error('Error fetching matches:', error);
    }
    // console.log({retrievedMatches})

    // Inserting new match rows into DB
    try {
        const stmt = await conn.prepare(MATCHES_INSERT_SQL_STATEMENT);
        for (const match of retrievedMatches) {
            const matchFieldBinds = MATCHES_INSERT_BIND_FUN(match);
            stmt.bind(matchFieldBinds);
            const status = await stmt.run();
            console.log("Inserted match row:", matchFieldBinds.match_id);
        }
    } catch (error) {
        console.error('Error inserting match rows to table: ', error)
    }

    ////
    // PROFILES
    ////

    //// Updating profiles in db
    // Recreating table
    try {
        await conn.run(PROFILES_CREATETABLE_SQL_STATEMENT);
    } catch (error) {
        console.error('Error creating profiles table', error);
    }

    // console.log({savedMatchRawJSONs})


    // ANOTHER HACK: We need to update the non-Leetify profile user with real match IDs, because they get crap ids - that aren't joinable with the retrieved matches.
    const allMatches = [...savedMatchRawJSONs, ...retrievedMatches];
    // console.log({t: JSON.stringify(savedMatchRawJSONs).slice(0,100), z: savedMatchRawJSONs.length});

    const updatedNonLeetifyUsersProfiles = nonLeetifyUsersProfiles.map(profile => ({
        ...profile,
        games: profile.games.map(g => {
            const {gameId, gameFinishedAt, tLeetifyRating, ctLeetifyRating} = g;

            // These are the identifying conditions found best via testing
            const identifiedMatches = allMatches.filter(f => 
                f.finishedAt.slice(0,10) == gameFinishedAt.slice(0,10) // Same date
                && f.playerStats.find(ps => ps.steam64Id == profile.meta.steam64Id) // Player is playing the game
                && ((f.playerStats.find(ps => ps.steam64Id == profile.meta.steam64Id).ctLeetifyRating ?? 0) == ctLeetifyRating) // Player scored the exact ratings for ct and t
                && ((f.playerStats.find(ps => ps.steam64Id == profile.meta.steam64Id).tLeetifyRating ?? 0) == tLeetifyRating)
            )

            const foundLeetifyMatch = identifiedMatches.length == 1;
            const adjustedGameId = foundLeetifyMatch ?  identifiedMatches[0].id : gameId

            return {
                ...g,
                adjustedGameId,
                foundLeetifyMatch
            };
        })
    }))

    const finalProfiles = [...leetifyUsersProfiles, ...updatedNonLeetifyUsersProfiles]
                                    
    // // Populating profile rows
    try {
        const stmt = await conn.prepare(PROFILES_INSERT_SQL_STATEMENT);
        for (const profile of finalProfiles) {
            const profileFieldBinds = PROFILES_INSERT_BIND_FUN(profile);
            stmt.bind(profileFieldBinds);
            const status = await stmt.run();
            console.log("Inserted profile row:", profileFieldBinds.profile_id);
        }
    } catch (error) {
        console.error('Error inserting rows to table: ', error)
    }

    conn.closeSync();
}

main().catch(err => console.error('An error occurred:', err));