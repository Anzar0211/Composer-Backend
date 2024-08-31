'use strict'

const{graphqlHTTP}=require("express-graphql");
const schema=require('../../schemas/items/index.js');
const resolvers=require('../../resolvers/items/index.js');

console.log('In controllers');

module.exports = graphqlHTTP((req, res) => ({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
    context: res,
}));