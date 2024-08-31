"use strict";
const { buildSchema } = require("graphql");

console.log('In schemas');
// Define the schema
module.exports = buildSchema(`
    type Product {
        id: ID!
        name: String!
        category: String!
        image: String!
        recommended: Boolean
    }

    input ProductInput {
        id: ID!
        body: ProductInputBody!
    }

    input ProductInputBody {
        name: String!
        category: String!
        image: String!
        recommended: Boolean
    }

    input PartialProductInput {
        name: String
        category: String
        image: String
        recommended: Boolean
    }

    type Query {
    searchItems(name: String, category: String, recommended: Boolean!): [Product]
    getById(id:ID!):Product
    getAllProducts:[Product]
    }

    type Mutation {
        insertMany(products: [ProductInput]!): [Product]
        insert(product: ProductInput!):Product
        deleteProduct(id:ID!):Boolean
        editProduct(id:ID!,productInput:PartialProductInput!):Boolean
    }
`);
