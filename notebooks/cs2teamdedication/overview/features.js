import { getWeekStreak, getWeeksAgo, dateFixer } from '../utils.js'

// Main function that goes over all feature builders
export function overviewFeatures(
    profileBaseWithMatches,
    params
  ) {
  
    return featuresBuilders.reduce(
      (profilesDF, fun) =>
        profilesDF.map((profile) => ({ ...profile, ...fun(profile, params) })),
      profileBaseWithMatches
    );
  }

// List of feature builders, in order
export const featuresBuilders = [sessionDate, weekStreak, weeksAgo, gameCountLast5weeks];

/////
// Feature definitions
////

// Profile features
function weekStreak({ games },{refDate}) {
    return ({
        weekStreak: getWeekStreak(
            games.map((g) => g.sessionDate),
            refDate
        )
    });
}

function gameCountLast5weeks({ games },{}) {
    return ({
        gameCountLast5weeks: games.filter((g) => g.weeksAgo <= 5).length
    });
}

// Games features
function sessionDate({ games },{ sessionDateColumn }) {
    return ({
        games: games.map((g) => ({
            ...g,
            sessionDate: dateFixer(g[sessionDateColumn])
        }))
    });
} 

function weeksAgo({ games },{ refDate }) {
    return ({
        games: games.map((g) => ({
            ...g,
            weeksAgo: getWeeksAgo(g.sessionDate, refDate) + 1
        }))
    });
} 