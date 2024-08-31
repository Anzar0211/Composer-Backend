const{search,get,getAllProducts,insert,insertMultiple, deleteProduct, edit}=require('../../db/queries/query')
console.log('In resolvers');

module.exports = {
  searchItems: async ({ name, category, recommended }) => {
    try {
      // Check if at least one search parameter is provided

      if (!name && !category && recommended === undefined) {
        throw new Error(
          "At least one search parameter (name, category, or recommended) must be provided."
        );
      }

      // Construct the search query based on the provided arguments
      const searchQuery = {
        ...(name && { name }),
        ...(category && { category }),
        ...(recommended !== undefined && { recommended }),
      };
      console.log(searchQuery);
      // Perform the search and return the results
      const results = await search(searchQuery);
      
      return results;
    } catch (error) {
      console.error("Error searching items:", error);
      throw error;
    }
  },
  getById: async ({ id }, context) => {
    try {
      const { res } = context;
      const result = await get(id);
      return result;
    } catch (error) {
      console.error("Error getting from  products:", error);
    }
  },
  insert: async ({ product }, context) => {
    try {
      const { res } = context;
      const result = await insert(product.id, product, false);

      return { id: product.id, ...product.body };
      //   return result;
    } catch (error) {
      console.error("Error inserting many products:", error);
    }
  },
  insertMany: async ({ products }, context) => {
    try {
      const { res } = context;
      // console.log(products);
      const result = await insertMultiple(products);
      return result;
    } catch (error) {
      console.error("Error inserting many products:", error);
    }
  },
  getAllProducts: async (context) => {
    try {
      const { res } = context;
      const result = await getAllProducts();
      return result;
    } catch (error) {
      console.error("Error getting  products:", error);
    }
  },
  deleteProduct: async ({ id }, context) => {
    try {
      const { res } = context;
      const result = await deleteProduct(id);
      return result;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  },
  editProduct: async ({ id, productInput }, context) => {
    try {
      console.log(productInput);
      const { res } = context;
      const result = await edit(id, productInput);
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  },
};

  // searchItems: async function ({ name,category, recommended }, context) {
  //   console.log("Request Object:", { name,category, recommended });
  //   const res = context;
  //   try {
  //     let req = {};
  //     if (Boolean(category)) {
  //       req.category = String(category);
  //     }
  //     if (Boolean(recommended)) {
  //       req.recommended = Boolean(recommended);
  //     }
  //     console.log("Elasticsearch Query:", req); // Log the query
  //     const result = await search(req);
  //     console.log("Search Result:", result); // Log the result
  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //     return [];
  //   }
  // },