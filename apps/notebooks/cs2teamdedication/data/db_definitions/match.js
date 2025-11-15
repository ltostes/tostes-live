// import { PROFILE_LIST } from '../constants.js';
import { PROFILE_LIST, dateRounding } from '../constants.js';

export const MATCHES_TABLENAME = 'matches';

export const MATCHES_SCHEMA_FIELDS = [
    {
        name: "match_id",
        type: "TEXT",
        ac_fun: (match) => match.id,
        primary_key: true,
    },
    {
        name: "session_date",
        type: "DATE",
        ac_fun: (match) => dateRounding(match.finishedAt)
    },
    {
        name: "map_name",
        type: "TEXT",
        ac_fun: (match) => match.mapName
    },
    {
        name: "retrieval_date",
        type: "DATE",
        ac_fun: (match) => match.retrievalDate
    },
    {
        name: "raw_json",
        type: "JSON",
        ac_fun: (match) => JSON.stringify(match)
    },
]

export const MATCHES_CREATETABLE_SQL_STATEMENT = (
`CREATE TABLE IF NOT EXISTS ${MATCHES_TABLENAME} (${
        MATCHES_SCHEMA_FIELDS.map(({name, type, primary_key}) => (
            `\n     ${name} ${type}${primary_key ? ' PRIMARY KEY' : ''}`
        )).join(',')
    }
);`
);

export const MATCHES_INSERT_SQL_STATEMENT = (
    `INSERT OR REPLACE INTO ${MATCHES_TABLENAME} 
    (${MATCHES_SCHEMA_FIELDS.map(({name}) => name).join(',')})
    VALUES (${MATCHES_SCHEMA_FIELDS.map(({name}) => `\$${name}`).join(',')});`
);

export const MATCHES_INSERT_BIND_FUN = (match) => Object.assign({},...MATCHES_SCHEMA_FIELDS.map(({name, ac_fun}) => ({[name]: ac_fun(match)})));

// // This testing part of the script must be uncommented and run in notebooks root

// import { readFile } from 'fs/promises';

// const TEST_MATCH_PATH = '.observable/data/sample_match.json';
// const TEST_MATCH_RAW = await readFile(TEST_MATCH_PATH);
// const TEST_MATCH = await JSON.parse(TEST_MATCH_RAW);

// console.log(MATCHES_CREATETABLE_SQL_STATEMENT);
// console.log(MATCHES_INSERT_SQL_STATEMENT);
// console.log(MATCHES_INSERT_BIND_FUN(TEST_MATCH));