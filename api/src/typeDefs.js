const { gql } = require('apollo-server')

// The GraphQL schema
exports.typeDefs = gql`
  type Pokemon {
    id: ID!
    num: String!
    img: String!
    name: String!
    type: [String!]!
    height: String!
    weight: String!
    candy: String!
    candy_count: Int!
    egg: String!
    spawn_chance: Float!
    avg_spawns: Int!
    spawn_time: String!
    multipliers: [Float!]
    weaknesses: [String!]!
    prev_evolution: [Pokemon!]
    next_evolution: [Pokemon!]
  }

  type Query {
    pokemonMany: [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
    pokemonTypes: [String!]!
    pokemonWeaknesses: [String!]!
  }
`
