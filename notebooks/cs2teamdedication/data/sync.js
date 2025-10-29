import { DuckDBInstance } from '@duckdb/node-api';

import { PROFILE_LIST, MULTI_PROFILES, dateRounding, gameSort } from './constants.js';
import { PROFILES_CREATETABLE_SQL_STATEMENT, PROFILES_INSERT_SQL_STATEMENT, PROFILES_INSERT_BIND_FUN } from './db_definitions/profile.js';
import { MATCHES_SCHEMA_FIELDS , MATCHES_CREATETABLE_SQL_STATEMENT , MATCHES_INSERT_SQL_STATEMENT , MATCHES_INSERT_BIND_FUN  } from './db_definitions/match.js';
import { PLAYERMATCHES_COMPOSITE_SCHEMA_FIELDS, PLAYERMATCHES_CREATETABLE_SQL_STATEMENT, PLAYERMATCHES_INSERT_SQL_STATEMENT, PLAYERMATCHES_INSERT_BIND_FUN  } from './db_definitions/player_match.js';
import { fetchProfiles, fetchMatches } from './fetches.js';

// Duck DB path
const DB_PATH = '.observable/data/cs2teamdedication.duckdb'

// Local flag (so we don't retrieve from the Leetify API)
const is_local = process.argv.slice(2).includes('--local');

async function getProfilesFromAPI(list) {

    // Fetching profiles data
    let profiles = [];
    try {
        // Collecting profile info
        profiles = await fetchProfiles(list.map(p => p.id));
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }

    // TINY HACK: for retrieving the matches, we need to know if the profile is a Leetify user, so let's add that to the profiles raw_json
    // Reason: match_ids are only retrievable when it is such an user
    profiles = profiles.map((p) =>({
        ...p,
        isLeetifyUser: p.personalBestsCs2 != null,
    }))
    
    console.log(`Fechted ${profiles.length} profiles!`)

    return profiles
}

function getAllPlayedMatchIdsFromProfiles(profiles) {

    const leetifyUsersProfiles = profiles.filter(f => f.isLeetifyUser);
    const nonLeetifyUsersProfiles = profiles.filter(f => !f.isLeetifyUser);

    // Retrieving all unique matches played from Leetify profiles (we'll get the diff from DB and retrieve them online)
    const allPlayedMatches = [...new Set(
                                leetifyUsersProfiles
                                .map(p => p.games)
                                .flat()
                                .map(g => g.gameId)
                              )];

    return allPlayedMatches;
}

async function createDBTable(create_sql, conn, name='') {
    try {
        await conn.run(create_sql);
    } catch (error) {
        console.error(`Error creating ${name} table`, error);
    }
    console.log(`Re-created ${name} table!`)
}

async function updateMatchesDBTableSchema(conn) {

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
    console.log('Updated match table schema!')
}

async function getAllMatchesFromDB(conn) {
    
    // Let's retrieve all saved matches that will be used for PROFILES and PROFILE MATCHES
    let allMatches = [];
    try {
        const result = await conn.run('SELECT raw_json FROM matches');
        const rows = await result.getRows();
        allMatches = rows.map(r => JSON.parse(r[0]));
    } catch (error) {
        console.error('Error retrieving all matches', error);
    }
    console.log(`Retrieved all ${allMatches.length} matches from DB!`)

    return allMatches;
}

async function getAllProfilesFromDB(conn) {
    
    // Let's retrieve all profiles from DB
    let allProfiles = [];
    try {
        const result = await conn.run('SELECT raw_json FROM profiles');
        const rows = await result.getRows();
        allProfiles = rows.map(r => JSON.parse(r[0]));
    } catch (error) {
        console.error('Error retrieving all matches', error);
    }
    console.log(`Retrieved all ${allProfiles.length} profiles from DB!`)

    return allProfiles;
}

async function getMatchesFromAPI(ids_list, conn) {
    
    // // Fetching matches
    let retrievedMatches = [];
    try {
        // Collecting profile info
        retrievedMatches = await fetchMatches(ids_list);
    } catch (error) {
        console.error('Error fetching matches from API:', error);
    }
    console.log(`Fetched ${ids_list.length} matches from api!`)

    return retrievedMatches;
}

async function addMatchesToDB(matches, conn) {
    
    // Inserting new match rows into DB
    try {
        const stmt = await conn.prepare(MATCHES_INSERT_SQL_STATEMENT);
        for (const match of matches) {
            const matchFieldBinds = MATCHES_INSERT_BIND_FUN(match);
            stmt.bind(matchFieldBinds);
            const status = await stmt.run();
            console.log("Inserted match row:", matchFieldBinds.match_id);
        }
    } catch (error) {
        console.error('Error inserting match rows to table: ', error)
    }
    console.log(`Inserted ${matches.length} new matches to DB!`)
}

async function addProfilesToDB(profiles, conn) {
    try {
        const stmt = await conn.prepare(PROFILES_INSERT_SQL_STATEMENT);
        for (const profile of profiles) {
            const profileFieldBinds = PROFILES_INSERT_BIND_FUN(profile);
            stmt.bind(profileFieldBinds);
            await stmt.run();
        }
    } catch (error) {
        console.error('Error inserting profile rows to table: ', error)
    }
    console.log(`Populated profiles table with ${profiles.length} profiles!`)
}

async function addProfileMatchesToDB(profile_matches, conn) {
    try {
        const stmt = await conn.prepare(PLAYERMATCHES_INSERT_SQL_STATEMENT);
        for (const profile_match of profile_matches) {
            const profileMatchFieldBinds = PLAYERMATCHES_INSERT_BIND_FUN(profile_match);
            stmt.bind(profileMatchFieldBinds);
            await stmt.run();
        }
    } catch (error) {
        console.error('Error inserting profile matches rows to table: ', error)
    }
    console.log(`Populated profile matches table with ${profile_matches.length} profile-matches!`)
}

function updateNonLeetifyProfilesMatchIDs(profiles, matches) {
    // ANOTHER HACK: We need to update the non-Leetify profile user with real match IDs, because they get crap ids - that aren't joinable with the retrieved matches.
    const leetifyUsersProfiles = profiles.filter(f => f.isLeetifyUser);
    const nonLeetifyUsersProfiles = profiles.filter(f => !f.isLeetifyUser);

    const updatedNonLeetifyUsersProfiles = nonLeetifyUsersProfiles.map(profile => ({
        ...profile,
        games: profile.games.map(g => {
            const {gameId, gameFinishedAt, tLeetifyRating, ctLeetifyRating} = g;

            // These are the identifying conditions found best via testing
            const identifiedMatches = matches.filter(f => 
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

    return [...leetifyUsersProfiles, ...updatedNonLeetifyUsersProfiles];
}

function getProfilesMatchesObjects(profiles, matches) {
    const profile_matches = profiles.map(profile => [
        ...profile.games.map(game => {
            const { isLeetifyUser } = profile;
            const { gameId, adjustedGameId } = game;

            const finalGameId = isLeetifyUser ? gameId : adjustedGameId;

            return {
                profile,
                ...game,
                joinedMatch: matches.find(({id}) => finalGameId == id)
            };
        })
    ]).flat()

    return profile_matches
}

async function main() {

    // Connecting to db
    const instance = await DuckDBInstance.create(DB_PATH);
    const conn = await instance.connect();

    // Profiles
    const profiles = !is_local ? await getProfilesFromAPI(PROFILE_LIST) : await getAllProfilesFromDB(conn);
    const allPlayedMatches = getAllPlayedMatchIdsFromProfiles(profiles);

    // Matches
    await createDBTable(MATCHES_CREATETABLE_SQL_STATEMENT, conn, 'matches');
    await updateMatchesDBTableSchema(conn);

    if (!is_local) { // If we're not local we can attempt to retrieve missing matches

        // Retrieving already saved matches from DB
        const alreadySavedMatches = await getAllMatchesFromDB(conn);
        const alreadySavedMatchIds = alreadySavedMatches.map(m => m.id);

        // Calculating the matches we have yet to retrieve
        const matchesToRetrieve = allPlayedMatches.filter(f => !is_local && !alreadySavedMatchIds.includes(f))

        // // Fetching matches
        const retrievedMatches = await getMatchesFromAPI(matchesToRetrieve, conn);

        // Inserting new match rows into DB, if any
        retrievedMatches.length > 1 && await addMatchesToDB(retrievedMatches, conn);
    }

    // Let's retrieve all saved matches that will be used for PROFILES and PROFILE MATCHES
    const allMatches = await getAllMatchesFromDB(conn);

    // Updating Non-leetify users with real match IDs
    const finalProfiles = updateNonLeetifyProfilesMatchIDs(profiles, allMatches);
    
    // Profiles in DB
    await createDBTable(PROFILES_CREATETABLE_SQL_STATEMENT, conn, 'profiles');
    await addProfilesToDB(finalProfiles, conn);

    //// Profile matches
    // Let's get profile matches enriched with leetify matches to populate PROFILES MATCHES
    const profile_matches = getProfilesMatchesObjects(finalProfiles, allMatches);
    
    //// Updating profile matche in db
    // Recreating table
    await createDBTable(PLAYERMATCHES_CREATETABLE_SQL_STATEMENT, conn, 'profile matches');
                                    
    // // Populating profile rows
    await addProfileMatchesToDB(profile_matches, conn);

    conn.closeSync();
}

main().catch(err => console.error('An error occurred:', err));