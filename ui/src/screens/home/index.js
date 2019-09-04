import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import _ from 'lodash'

import SearchBox from '../../components/SearchBox'
import PokemonCard from '../../components/PokemonCard'
import * as S from './styled'

export default function HomeScreen() {
  const { loading, error, data } = useQuery(gql`
    {
      pokemonMany {
        name
        num
        img
        type
        weaknesses
      }
      pokemonTypes
      pokemonWeaknesses
    }
  `)
  if (loading)
    return (
      <S.Container>
        <p>Loading...</p>
      </S.Container>
    )
  if (error)
    return (
      <S.Container>
        <p>Error :(</p>
      </S.Container>
    )
  return (
    <S.Container>
      <h1>Pokédex</h1>
      <SearchBox
        suggestions={data.pokemonMany.map(pokemon => ({
          label: pokemon.name,
          value: pokemon.num,
        }))}
        types={data.pokemonTypes}
        weaknesses={data.pokemonWeaknesses}
      >
        {(searchValue, filter) => (
          <S.Grid>
            {data.pokemonMany
              .filter(pokemon => {
                let include = true;
                if (filter.types.length > 0) {
                  include = pokemon.type.filter(t => filter.types.includes(t)).length !== 0
                }
                if (filter.weaknesses.length > 0) {
                  include = pokemon.weaknesses.filter(w => filter.weaknesses.includes(w)).length !== 0
                }
                if (searchValue) {
                  include = _.deburr(pokemon.name.toLowerCase()).includes(
                    _.deburr(searchValue.toLowerCase())
                  )
                }
                return include
              })
              .map(pokemon => (
                <S.CardContainer key={pokemon.num}>
                  <S.CardLink to={`/${pokemon.num}`}>
                    <PokemonCard
                      key={pokemon.num}
                      pokemon={pokemon}
                      isSmall
                      animateHovering
                    />
                  </S.CardLink>
                </S.CardContainer>
              ))}
          </S.Grid>
        )}
      </SearchBox>
    </S.Container>
  )
}
