import { PROFILE_LIST, MULTI_PROFILES, dateRounding, gameSort } from '../constants.js';

export const PROFILES_TABLENAME = 'profiles';

// // Pruning profiles dataframe
// const profilesBaseDF = profiles
//                         .filter(profile => !Object.keys(MULTI_PROFILES).includes(profile.meta.name))
//                         .map(profile => ({
//                             name: profile.meta.name ?? PROFILE_LIST.find(f => f.id == profile.meta.steam64Id).altname,
//                             id: profile.meta.steam64Id,
//                             avatar: profile.meta.steamAvatarUrl,
//                             recentRatings: profile.recentGameRatings,
//                             personalBestsCS2: profile.personalBestsCs2,
//                             games: profile.games.map(g => g.gameId),
//                             ...profile
//                         }))

export const PROFILES_SCHEMA_FIELDS = [
    {
        name: "profile_id",
        type: "TEXT",
        ac_fun: (profile) => profile.meta.steam64Id,
        primary_key: true,
    },
    {
        name: "retrieval_date",
        type: "DATE",
        ac_fun: (profile) => new Date().toISOString().slice(0, 10)
    },
    {
        name: "name",
        type: "TEXT",
        ac_fun: (profile) => profile.meta.name ?? PROFILE_LIST.find(f => f.id == profile.meta.steam64Id).altname,
    },
    {
        name: "avatar",
        type: "TEXT",
        ac_fun: (profile) => profile.meta.steamAvatarUrl,
    },
    {
        name: "recentRatings",
        type: "JSON",
        ac_fun: (profile) => JSON.stringify(profile.recentGameRatings),
    },
    {
        name: "personalBestsCS2",
        type: "JSON",
        ac_fun: (profile) => JSON.stringify(profile.personalBestsCs2),
    },
    {
        name: "games",
        type: "TEXT[]",
        ac_fun: (profile) => JSON.stringify(profile.games.map(g => g.gameId)),
    },
    {
        name: "raw_json",
        type: "JSON",
        ac_fun: (profile) => JSON.stringify(profile)
    },
]

export const PROFILES_CREATETABLE_SQL_STATEMENT = (
`CREATE OR REPLACE TABLE ${PROFILES_TABLENAME} (${
        PROFILES_SCHEMA_FIELDS.map(({name, type, primary_key}) => (
            `\n     ${name} ${type}${primary_key ? ' PRIMARY KEY' : ''}`
        )).join(',')
    }
);`
);

export const PROFILES_INSERT_SQL_STATEMENT = (
    `INSERT OR REPLACE INTO ${PROFILES_TABLENAME} 
    (${PROFILES_SCHEMA_FIELDS.map(({name}) => name).join(',')})
    VALUES (${PROFILES_SCHEMA_FIELDS.map(({name}) => `\$${name}`).join(',')});`
);

export const PROFILES_INSERT_BIND_FUN = (profile) => Object.assign({},...PROFILES_SCHEMA_FIELDS.map(({name, ac_fun}) => ({[name]: ac_fun(profile)})));

// // This testing part of the script must be run in notebooks root

// import { readFile } from 'fs/promises';

// const TEST_PROFILE_PATH = '.observable/data/sample_profile.json';
// const TEST_PROFILE_RAW = await readFile(TEST_PROFILE_PATH);
// const TEST_PROFILE = await JSON.parse(TEST_PROFILE_RAW);

// console.log(PROFILES_CREATETABLE_SQL_STATEMENT);
// console.log(PROFILES_INSERT_SQL_STATEMENT);
// console.log(PROFILES_INSERT_BIND_FUN(TEST_PROFILE));