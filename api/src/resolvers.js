const _ = require('lodash')

// A map of functions which return data for the schema.
exports.resolvers = {
  Pokemon: {
    prev_evolution: (parent, args, context, info) => {
      const prevEvolutionIDs = parent.prev_evolution
        ? parent.prev_evolution.map(prevEvolution => prevEvolution.num.replace(/0/g, ''))
        : []
      return prevEvolutionIDs.map(id => context.pokemon[id])
    },
    next_evolution: (parent, args, context, info) => {
      const nextEvolutionIDs = parent.next_evolution
        ? parent.next_evolution.map(nextEvolution => nextEvolution.num.replace(/0/g, ''))
        : []
      return nextEvolutionIDs.map(id => context.pokemon[id])
    },
  },
  Query: {
    pokemonMany: (parent, args, context, info) => _.values(context.pokemon),
    pokemonOne: (parent, args, context, info) => context.pokemon[args.id],
    pokemonTypes: (parent, args, context, info) =>  _.uniq(_.flatten(_.values(context.pokemon).map(p => p.type))),
    pokemonWeaknesses: (parent, args, context, info) => _.uniq(_.flatten(_.values(context.pokemon).map(p => p.weaknesses))),
  },
}
