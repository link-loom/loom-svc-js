const axios = require('axios');
const config = require('config');
const fs = require('fs');
const path = require('path');

// Base URL constructed from the server port setting in the configuration.
const apiBaseUrl = `http://localhost:${config?.get('server.port')}`;

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
 * Determines the type of a variable, distinguishing between arrays and other types.
 *
 * @param {*} data - Variable to evaluate.
 * @returns {string} Type of the variable ('array' or other JavaScript type).
 */
function getType(data) {
  return Array.isArray(data) ? 'array' : typeof data;
}

/**
 * Checks if a path is accessible in the file system.
 *
 * @param {string} route - Path to validate.
 * @returns {boolean} True if the path is accessible, false otherwise.
 */
function isPathAccessible(route) {
  try {
    fs.accessSync(route, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Processes an individual item for seeding in the database.
 *
 * @param {Object} item - Object with data to seed.
 * @param {Array} results - Array to store results.
 * @param {Object} route - Object with API route information.
 */
async function seedDatabase(item, results, route) {
  const postData = { ...item };
  delete postData.identifier;
  delete postData.dependsOn;

  // dependencies resolution
  if (Array.isArray(item.dependsOn)) {
    for (const dependency of item.dependsOn) {
      const { dependencyIdentifier, dependencyProperty, useOn } = dependency;

      if (!createdRecords[dependencyIdentifier]) {
        throw new Error(
          `Dependency ${dependencyIdentifier} not found for ${item.identifier}`,
        );
      }

      postData[useOn] =
        createdRecords[dependencyIdentifier][dependencyProperty];
    }
  }

  // Send the request to create the record via the API.
  const response = await sendRequest(
    route.method,
    `${apiBaseUrl}${route.path}`,
    postData,
  );

  // If the response indicates success, store the created record's data and id.
  if (response.success) {
    const responseData = response.result;

    if (item.identifier && responseData && !responseData.error) {
      createdRecords[item.identifier] = responseData;
    }

    results.push(responseData.id);
  }
}

/**
 * Processes an array of seed data.
 *
 * @param {Array} seedContentArray - Array with seed configuration.
 * @param {Array} results - Array to store results.
 */
async function handleArrayOfSeedData(seedContentArray, results) {
  for (const seed of seedContentArray) {
    const { seedData: seedDataPath, route } = seed;
    const seedFilePath = path.join(__dirname, seedDataPath);
    const isFilePathValid = isPathAccessible(seedFilePath);

    if (!isFilePathValid) {
      throw new Error(`Invalid path: ${seedFilePath}`);
    }

    const seedContent = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));
    await seedDatabase(seedContent, results, route);
  }
}

/**
 * Processes seed data.
 *
 * @param {Array} seedData - Data to be seeded.
 * @param {Array} results - Array to store results.
 * @param {Object} route - Object with API route information.
 */
async function handleSeedData(seedData, results, route) {
  for (const item of seedData) {
    await seedDatabase(item, results, route);
  }
}

/**
 * Processes a seed file to create records using the API.
 * @param {string} seedFile - The path to the seed file to be processed.
 * @returns {Promise<Array>} - An array of results from the seeding operations.
 */
async function runSeed(seedFile) {
  try {
    const seedContent = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    const results = [];
    const seedDataType = getType(seedContent);

    switch (seedDataType) {
      case 'array':
        await handleArrayOfSeedData(seedContent, results);
        break;
      case 'object':
        const { route, seedData } = seedContent;
        await handleSeedData(seedData, results, route);
        break;
      default:
        break;
    }

    return results;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
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
