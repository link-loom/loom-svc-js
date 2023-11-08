const axios = require('axios');
const config = require('config');
const fs = require('fs');
const path = require('path');

// Base URL constructed from the server port setting in the configuration.
const apiBaseUrl = `http://localhost:${config.get('SERVER.PORT')}`;

// Object to hold the mappings of identifier to created record for reference.
const createdRecords = {};

/**
 * Sends an HTTP request using axios with the given method, url, and data.
 * @param {string} method - The HTTP method (e.g., 'POST', 'GET').
 * @param {string} url - The URL to which the request is sent.
 * @param {Object} data - The data to be sent as the request body.
 * @returns {Promise<Object>} - The data from the response if successful, or an error object.
 */
async function sendRequest(method, url, data) {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    return { error: error.response ? error.response.data : error.message };
  }
}

/**
 * Processes a seed file to create records using the API.
 * @param {string} seedFile - The path to the seed file to be processed.
 * @returns {Promise<Array>} - An array of results from the seeding operations.
 */
async function runSeed(seedFile) {
  try {
    const seedContent = JSON.parse(fs.readFileSync(seedFile));
    const { route, seedData } = seedContent;
    const results = [];

    for (const item of seedData) {
      // Clone item data and remove control properties like 'identifier' and 'dependsOn'.
      const dataToPost = { ...item };
      delete dataToPost.identifier;
      delete dataToPost.dependsOn;

      // Resolve dependencies if they exist, now assuming 'dependsOn' is an array of objects.
      if (Array.isArray(item.dependsOn)) {
        for (const dependency of item.dependsOn) {
          const { 
            dependencyIdentifier,
            dependencyProperty,
            useOn 
          } = dependency;

          // Throw an error if the required dependency is not found in createdRecords.
          if (!createdRecords[dependencyIdentifier]) {
            throw new Error(`Dependency ${dependencyIdentifier} not found for ${item.identifier}`);
          }

          // Assign the dependency's property value to the specified field in the data to be posted.
          dataToPost[useOn] = createdRecords[dependencyIdentifier][dependencyProperty];
        }
      }

      // Send the request to create the record via the API.
      const response = await sendRequest(route.method, `${apiBaseUrl}${route.path}`, dataToPost);

      // If the response indicates success, store the created record's data and id.
      if (response.success) {
        const responseData = response.result;

        if (item.identifier && responseData && !responseData.error) {
          createdRecords[item.identifier] = responseData;
        }

        results.push(responseData.id);
      }
    }

    return results;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    return { error: errorMessage, success: false };
  }
}

/**
 * The main function that reads the seed configuration and sequentially processes each seed file.
 */
async function main() {
  // Define directories for seed files and configuration.
  const seedsDir = path.join(__dirname, 'seeds');
  const seedConfigDir = path.join(__dirname, 'config');
  
  // Read the seed order configuration.
  const seedsOrderFile = path.join(seedConfigDir, 'seeds-config.json');
  const seedsOrder = JSON.parse(fs.readFileSync(seedsOrderFile));

  // Iterate over each seed file in the order specified by the configuration.
  for (const fileName of seedsOrder) {
    const seedPath = path.join(seedsDir, fileName);
    console.log(`Seeding: ${fileName}`);
    
    // Process each seed file and log the results.
    const results = await runSeed(seedPath);

    console.log(`Results for ${fileName}:`);
    console.table(results);
  }
}

// Run the main function and catch any unhandled errors.
main().catch(console.error);
