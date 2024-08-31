    "use strict";

    const { retryWithBackoff } = require("../connections");
    const {
    runStandalone,
    createIndexWithMapping,
    insertMultiple,
    getAllProducts,
    } = require("../queries/query");
    const itemsData = require("./itemsData.json");

    async function prefillDatabase(client) {
    console.log("Starting database prefill process...");

    try {
        await retryWithBackoff(() => runStandalone(client));
        await createIndexWithMapping(client);

        // Check if data already exists
        console.log("Checking for existing products...");
        const existingProducts = await getAllProducts(client);
        console.log(`Found ${existingProducts.length} existing products.`);

        if (existingProducts.length === 0) {
        console.log("Preparing to insert data...");

        // Format the data (if necessary)
        const formattedData = itemsData.map((item) => ({
            id: item.id,
            body: {
            name: item.body.name,
            category: item.body.category,
            image: item.body.image,
            recommended: item.body.recommended,
            },
        }));

        // Insert the data
        console.log(`Inserting ${formattedData.length} items...`);
        const results = await insertMultiple( formattedData);
        console.log(`Insertion completed. ${results.length} items inserted.`);
        } else {
        console.log("Skipping data insertion as products already exist.");
        }

        console.log("Database prefill process completed successfully.");
    } catch (error) {
        console.error("Error during database prefill:", error);
        console.error("Error stack:", error.stack);
        throw error;
    }
    }

    module.exports = prefillDatabase;
