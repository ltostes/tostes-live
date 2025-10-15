import fetch from 'node-fetch';

export async function fetchProfile(profile_id) {
    const url = `https://api.cs-prod.leetify.com/api/profile/id/${profile_id}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const data_withRetrieval = {...data, retrievalDate: new Date().toISOString().slice(0, 10)};
      return data_withRetrieval; // Return the fetched data
    } catch (error) {
      console.error("Error fetching profile:", profile_id, error);
      throw error; // Throw an error if something goes wrong
    }
  }

export async function fetchProfiles(profiles) {
  try {
    // Map over profiles and create a fetch promise for each
    const promises = profiles.map((profile_id) => fetchProfile(profile_id));

    // Wait for all promises to resolve
    const results = await Promise.all(promises);
    return results; // Return the array of results
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error; // Handle errors appropriately
  }
}

export async function fetchMatchDetails(matchId) {
  const url = `https://api.cs-prod.leetify.com/api/games/${matchId}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const data_withRetrieval = {...data, retrievalDate: new Date().toISOString().slice(0, 10)};
    return data_withRetrieval; // Return the fetched data
  } catch (error) {
    console.error("Error fetching match details:", matchId, error);
    throw error; // Throw an error if something goes wrong
  }
}

export async function fetchMatches(matches) {
  try {
    // Map over profiles and create a fetch promise for each
    const promises = matches.map((matchId) => fetchMatchDetails(matchId));

    // Wait for all promises to resolve
    const results = await Promise.all(promises);
    return results; // Return the array of results
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error; // Handle errors appropriately
  }
}