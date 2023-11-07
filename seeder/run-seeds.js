const axios = require('axios');
const config = require('config');
const fs = require('fs');
const path = require('path');

// Base URL of the API constructed from the server's configuration.
const apiBaseUrl = `http://localhost:${config.get('SERVER.PORT')}`;

/**
 * Send a request to the specified URL using axios.
 * @param {string} method - The HTTP method to use (e.g., 'POST').
 * @param {string} url - The full URL to which the request is sent.
 * @param {Object} data - The data to be sent as the request's payload.
 * @returns {Promise<Object>} - An object containing the response data.
 */
async function sendRequest (method, url, data) {
  try {
    const response = await axios({ method, url, data });
    response.data.result = response.data.result.id
    return response.data
  } catch (error) {
    // Parsing error response for consistent error handling.
    return { error: error.response ? error.response.data : error.message };
  }
}

/**
 * Read the seed file, parse its contents and run seeding operations.
 * @param {string} seedFile - Path to the seed JSON file.
 * @returns {Promise<Array>} - An array of results from the seeding operations.
 */
async function runSeed (seedFile) {
  try {
    // Synchronously read and parse the seed file content.
    const seedContent = JSON.parse(fs.readFileSync(seedFile));
    const { route, seedData } = seedContent;
    const results = [];

    // Iterate over the seedData array and send HTTP requests for each item.
    for (const item of seedData) {
      const result = await sendRequest(route.method, `${apiBaseUrl}${route.path}`, item);

      results.push(result);
    }

    return results;
  } catch (error) {
    // Parsing error response for consistent error handling.
    const errorMessage = error.response ? error.response.data.message : error.message;
    return { error: errorMessage, success: false };
  }
}

/**
 * The main runner function that initializes the seeding process.
 * It reads all seed files and executes them in sequence.
 */
async function main () {
  // Directory path where seed files are located.
  const seedsDir = path.join(__dirname, 'seeds');
  // Read all files in seeds directory that end with '.json'.
  const seedFiles = fs.readdirSync(seedsDir).filter(file => file.endsWith('.json'));

  // Process each seed file found in the seeds directory.
  for (const file of seedFiles) {
    const seedPath = path.join(seedsDir, file);
    const results = await runSeed(seedPath);

    // Log the results for each seed file in a tabular format.
    console.log(`Results for ${file}:`);
    console.table(results);
  }
}

// Invoke the main function to start the seeding process.
main();
