const { checkElasticsearchConnection, retryWithBackoff } = require("../connections/index"); // Adjust the import statement

const utils = require("../utils");
// const index = "basic";
const index = "new";
const defaultFields = ["name", "category", "image", "recommended"];

exports.get = async function (id) {
  try {
    const client = await checkElasticsearchConnection();
    const result = await client.get({
      index: index,
      id,
      _source: defaultFields,
    });
    const item = result._source;
    item.id = result._id;
    return item;
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.search = async function (filter) {
  try {
    const client = await checkElasticsearchConnection();
    const { hits } = await client.search({
      index: index,
      _source: ["name", "category", "image", "recommended"], // Default fields to retrieve
      body: {
        query: utils.searchQuery(filter),
      },
    });
    console.log(hits);
    // Extract products from hits and include the id
    const products = hits.hits.map((ele) => {
      const product = ele._source;
      product.id = ele._id;
      return product;
    });

    return products;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// exports.search = async function (filter) {
//   try {
//     const client = await checkElasticsearchConnection();
//     const { hits } = await client.search({
//       index: index,
//       _source: defaultFields,
//       body: {
//         query: utils.searchQuery(filter),
//       },
//     });
//     const products = hits.hits.map((ele) => {
//       const product = ele._source;
//       product.id = ele._id;
//       return product;
//     });
//     return products;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

exports.edit = async function (id, body) {
  try {
    const client = await checkElasticsearchConnection();
    const { res } = await client.update({
      index: index,
      id,
      body: {
        doc: body,
      },
    });
    return true;
  } catch (error) {
    console.log("Error updating data", error);
    return false;
  }
}
exports.insert = async function (id, body,isInsertMultiple) {
  try {
    // console.log(body);
    const client = await checkElasticsearchConnection();

    const indexExists=await client.indices.exists({
      index:index
    })
    const { res } = await client.update({
      index: index,
      id,
      body: {
        doc: (indexExists && !isInsertMultiple) ? body.body : body,
        upsert: (indexExists && !isInsertMultiple) ? body.body : body,
      },
    });


    // Return the structured object
    
    return { id, ...body };
  } catch (error) {
    console.log("Error", error);
  }
};

exports.insertMultiple = async function (entries) {
  try {
    const isInsertMultiple=true
    const results = await Promise.all(
      entries.map(async function (entry) {
        try {
          const result = await module.exports.insert(entry.id, entry.body,isInsertMultiple);
          // return { success: true, result };
          return result;
        } catch (error) {
          console.log(error);
          return { success: false, error };
        }
      })
    );
    // console.log(results);
    return results;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getAllProducts = async () => {
  try {
    const client = await checkElasticsearchConnection();
    const resp = await client.search({
      index: index,
      body: {
        from: 0,
        size: 100,
        query: {
          match_all: {},
        },
      },
    });
    let hits = resp.hits.hits;
    return hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.runStandalone = async function runStandalone(client) {
  try {
    await client.ping();
    console.log("Elasticsearch is running");
  } catch (error) {
    console.error("Elasticsearch cluster is down!", error);
    throw error;
  }
};

exports.deleteProduct=async function(id){
    try {
        const client = await checkElasticsearchConnection();
        const { body } = await client.delete({
        index: index,
        id,
        });
        return true;
    } catch (error) {
        console.log("Error: ", error);
        return false;
    }
}

exports.searchProductByIndex = async function (itemIndex) {
  try {
    console.log(itemIndex);
    const client = await checkElasticsearchConnection();
    const result = await client.search({
      index: index,
      body: {
        query: {
          wildcard: {
            _index: `*${itemIndex}*`,
          },
        },
      },
    });
    const item = result.hits.hits[0]._source;
    return item;
  } catch (error) {
    console.error("Error searching for items:", error);
    return [];
  }
};

exports.createIndexWithMapping = async function (client) {
  return retryWithBackoff(async () => {
    try {
      const { body: indexExists } = await client.indices.exists({
        index: index,
      });
      if (!indexExists) {
        console.log("Creating new Index BASIC");
        await client.indices.create({
          index: index,
          body: {
            mappings: {
              properties: {
                name: { type: "text" },
                category: { type: "keyword" },
                image: { type: "text" },
                recommended: { type: "boolean" },
              },
            },
          },
        });
        console.log("Index created with mapping");
      } else {
        console.log("Index already exists, skipping creation");
      }
    } catch (error) {
      if (
        error.meta &&
        error.meta.statusCode === 400 &&
        error.meta.body.error.type === "resource_already_exists_exception"
      ) {
        console.log("Index already exists, skipping creation");
      } else {
        console.error("Error creating index:", error);
        throw error;
      }
    }
  });
};
async function main() {
  await createIndexWithMapping();
}
