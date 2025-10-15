import { PROFILE_LIST, dateRounding } from '../constants.js';

export const PLAYERMATCHES_TABLENAME = 'player_matches';

// hard coded composite primary key
const primary_key_statement = "PRIMARY KEY (profile_id, match_id)"

// Field acces based on joint profile-match enriched with leetify matches schema available:
// profile.games.map(game => (
// {
//         profile,
//         ...game,
//         joinedMatch: |best_match match|,
//         foundLeetifyMatch
// })
export const PLAYERMATCHES_BASE_SCHEMA_FIELDS = [
    {
        name: "profile_id",
        type: "TEXT",
        ac_fun: (match) => match.profile.meta.steam64Id,
    },
    {
        name: "match_id",
        type: "TEXT",
        ac_fun: (match) => match.gameId,
    },
    {
        name: "isLeetifyUser",
        type: "BOOL",
        ac_fun: (match) => match.profile.isLeetifyUser,
    },
    {
        name: "foundLeetifyMatch",
        type: "BOOL",
        ac_fun: (match) => match.profile.isLeetifyUser || match.foundLeetifyMatch,
    },
    {
        name: "session_date",
        type: "DATE",
        ac_fun: (match) => dateRounding(match.gameFinishedAt)
    },
    {
        name: "mapName",
        type: "TEXT",
        ac_fun: (match) => match.mapName
    },
    {
        name: "matchResult",
        type: "TEXT",
        ac_fun: (match) => match.matchResult
    },
    {
        name: "ownTeamScore",
        type: "INTEGER",
        ac_fun: (match) => match.scores[0]
    },
    {
        name: "enemyTeamScore",
        type: "INTEGER",
        ac_fun: (match) => match.scores[1]
    },
    {
        name: "rounds",
        type: "INTEGER",
        ac_fun: (match) => match.scores[0] + match.scores[1]
    },
    {
        name: "leetifyRating",
        type: "FLOAT",
        ac_fun: (match) => match.ownTeamTotalLeetifyRatings[match.profile.meta.steam64Id]
    },
    {
        name: "leetifyRatingRounds",
        type: "INTEGER",
        ac_fun: (match) => match.ownTeamTotalLeetifyRatingRounds[match.profile.meta.steam64Id]

    },
    {
        name: "tLeetifyRating",
        type: "FLOAT",
        ac_fun: (match) => match.tLeetifyRating
    },
    {
        name: "tLeetifyRatingRounds",
        type: "INTEGER",
        ac_fun: (match) => match.tLeetifyRatingRounds
    },
    {
        name: "ctLeetifyRating",
        type: "FLOAT",
        ac_fun: (match) => match.ctLeetifyRating
    },
    {
        name: "ctLeetifyRatingRounds",
        type: "INTEGER",
        ac_fun: (match) => match.ctLeetifyRatingRounds
    },
    // ... Here goes the leetify stats, defined next
]

const currentplayer_stats = (match) => ({ // A small prep for player_stats so that we don't need to pull each profile's score for every metric
    teamPartySize: match.joinedMatch.playerStats.filter(f => PROFILE_LIST.map(p => p.id).includes(f.steam64Id)).length,
    ...match.joinedMatch.playerStats.find(f => f.steam64Id == match.profile.meta.steam64Id)
})

export const PLAYERMATCHES_LEETIFYGAME_SCHEMA_FIELDS = [
    // Excluded (already available): session_date, mapName, matchResult, ownTeamScore, enemyTeamScore, kills, deaths, [t,ct]LeetifyRatings[+Rounds]
    {
        name: "teamPartySize",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.teamPartySize
    },
    {
        name: "kills",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.totalKills
    },
    {
        name: "assists",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.totalAssists
    },
    {
        name: "deaths",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.totalDeaths
    },
    {
        name: "roundsSurvived",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.roundsSurvived
    },
    {
        name: "mvps",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.mvps
    },
    {
        name: "personalPerformanceRating",
        type: "FLOAT",
        ac_fun: (match) => match.player_stats.personalPerformanceRating
    },

    // Match
    {
        name: "ctRoundsWon",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.ctRoundsWon
    },
    {
        name: "ctRoundsLost",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.ctRoundsLost
    },
    {
        name: "tRoundsWon",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.tRoundsWon
    },
    {
        name: "tRoundsLost",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.tRoundsLost
    },
    {
        name: "initialTeamNumber",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.initialTeamNumber
    },

    // Aim
    {
        name: "damage",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.totalDamage
    },
    {
        name: "shotsFired",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.shotsFired
    },
    {
        name: "shotsHitFoe",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.shotsHitFoe
    },
    {
        name: "shotsHitFoeHead",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.shotsHitFoeHead
    },
    {
        name: "shotsHitFriend",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.shotsHitFriend
    },
    {
        name: "reactionTime",
        type: "FLOAT",
        ac_fun: (match) => match.player_stats.reactionTime
    },
    {
        name: "sprayAccuracy",
        type: "FLOAT",
        ac_fun: (match) => match.player_stats.sprayAccuracy
    },
    // Utility
    {
        name: "utilityOnDeathAvg",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.utilityOnDeathAvg
    },
    {
        name: "smokeThrown",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.smokeThrown
    },
    {
        name: "flashbangThrown",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.flashbangThrown
    },
    {
        name: "molotovThrown",
        type: "INTEGER",
        ac_fun: (match) => match.player_stats.molotovThrown
    },
    // Raw
    {
        name: "profileStats_raw_json",
        type: "JSON",
        ac_fun: (match) => JSON.stringify(match.player_stats)
    },
]

export const PLAYERMATCHES_COMPOSITE_SCHEMA_FIELDS = [
    ...PLAYERMATCHES_BASE_SCHEMA_FIELDS,
    ...PLAYERMATCHES_LEETIFYGAME_SCHEMA_FIELDS
]

export const PLAYERMATCHES_CREATETABLE_SQL_STATEMENT = (
`CREATE OR REPLACE TABLE ${PLAYERMATCHES_TABLENAME} (${
        [
            ...PLAYERMATCHES_COMPOSITE_SCHEMA_FIELDS.map(({name, type}) => (
                `\n     ${name} ${type}`
            )),
            primary_key_statement
        ].join(',')
    });`
);

export const PLAYERMATCHES_INSERT_SQL_STATEMENT = (
    `INSERT OR REPLACE INTO ${PLAYERMATCHES_TABLENAME} 
    (${PLAYERMATCHES_COMPOSITE_SCHEMA_FIELDS.map(({name}) => name).join(',')})
    VALUES (${PLAYERMATCHES_COMPOSITE_SCHEMA_FIELDS.map(({name}) => `\$${name}`).join(',')});`
);

export const PLAYERMATCHES_INSERT_BIND_FUN = (match) => Object.assign({},
    // Base match infos
    ...PLAYERMATCHES_BASE_SCHEMA_FIELDS.map(({name, ac_fun}) => ({[name]: ac_fun(
                                                                                    match
                                                                                )})),
    // Match enriched with player stats
    ...PLAYERMATCHES_LEETIFYGAME_SCHEMA_FIELDS.map(({name, ac_fun}) => ({[name]: 
                                                                                !(match.profile.isLeetifyUser || match.foundLeetifyMatch) ? null : // If no good match found, return null
                                                                                ac_fun(
                                                                                    {
                                                                                        ...match, 
                                                                                        player_stats: currentplayer_stats(match)
                                                                                    }
                                                                                )}))
    );

// // This testing part of the script must be uncommented and run in notebooks root

// import { readFile } from 'fs/promises';

// const TEST_MATCH_PATH = '.observable/data/sample_match.json';
// const TEST_MATCH_RAW = await readFile(TEST_MATCH_PATH);
// const TEST_MATCH = await JSON.parse(TEST_MATCH_RAW);

// console.log(MATCHES_CREATETABLE_SQL_STATEMENT);
// console.log(MATCHES_INSERT_SQL_STATEMENT);
// console.log(MATCHES_INSERT_BIND_FUN(TEST_MATCH));