import React, { useState } from 'react'
import Downshift from 'downshift'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Popper, InputLabel, Input, MenuItem, Checkbox, ListItemText, Select, FormControl } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import _ from 'lodash'
import { navigate } from '@reach/router'

import * as S from './styled'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    maxWidth: 200,
  },
}));

function renderInput(inputProps) {
  const { InputProps, ref, ...other } = inputProps

  return (
    <S.Input
      InputProps={{
        inputRef: ref,
        ...InputProps,
      }}
      {...other}
    />
  )
}

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
  } = suggestionProps
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1

  if (isSelected) {
    navigate(`/${suggestion.value}`)
  } else {
    return (
      <S.MenuItem
        {...itemProps}
        key={suggestion.label}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {suggestion.label}
      </S.MenuItem>
    )
  }
}

function getSuggestions(value, { showEmpty = false } = {}, suggestions) {
  const inputValue = _.deburr(value.trim()).toLowerCase()
  if (inputValue.length < 2 && !showEmpty) {
    return []
  }
  return suggestions.filter(suggestion => {
    const suggestionLabel = _.deburr(suggestion.label.trim()).toLowerCase()
    return suggestionLabel.includes(inputValue)
  })
}

let popperNode
let filterNode

export default function SearchBox({ suggestions, children, types, weaknesses }) {
  const classes = useStyles();
  const [value, setValue] = useState('')
  const [pokemonTypes, setPokemonTypes] = useState([])
  const [pokemonWeaknesses, setPokemonWeaknesses] = useState([])
  const [anchorFilterEl, setAnchorFilterEl] = React.useState(null)

  function stateReducer(state, changes) {
    switch (changes.type) {
      case Downshift.stateChangeTypes.changeInput:
        setValue(changes.inputValue)
        return changes
      default:
        return changes
    }
  }

  function filterClicked(e) {
    setAnchorFilterEl(anchorFilterEl ? null : e.currentTarget)
  }

  function handlePokemonTypeChange(e) {
    setPokemonTypes(e.target.value)
  }

  function handlePokemonWeaknesses(e) {
    setPokemonWeaknesses(e.target.value)
  }

  const isFilterOpen = Boolean(anchorFilterEl)

  return (
    <Downshift inputValue={value} stateReducer={stateReducer}>
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
      }) => {
        const { onBlur, onFocus, ...inputProps } = getInputProps({
          placeholder: 'Search Pokémon...',
        })

        return (
          <div>
            <div>
              {renderInput({
                InputProps: { onBlur, onFocus },
                InputLabelProps: getLabelProps({ shrink: true }),
                inputProps,
                ref: node => {
                  popperNode = node
                },
              })}
              <FilterListIcon onClick={filterClicked} ref={node => {filterNode = node}}/>
              <Popper open={isFilterOpen} anchorEl={filterNode}>
                <Paper
                  square
                  style={{
                    marginTop: 8,
                    width: 500,
                    height: 200,
                    position: 'relative',
                    right: '2rem',
                  }}
                >
                  <div className={classes.root}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="PokemonType">Type</InputLabel>
                      <Select
                        multiple
                        value={pokemonTypes}
                        onChange={handlePokemonTypeChange}
                        input={<Input id="PokemonType" />}
                        renderValue={selected => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {types.map(type => (
                          <MenuItem key={type} value={type}>
                            <Checkbox checked={pokemonTypes.indexOf(type) > -1} />
                            <ListItemText primary={type} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="PokemonWeaknesses">Weaknesses</InputLabel>
                      <Select
                        multiple
                        value={pokemonWeaknesses}
                        onChange={handlePokemonWeaknesses}
                        input={<Input id="PokemonWeaknesses" />}
                        renderValue={selected => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {weaknesses.map(w => (
                          <MenuItem key={w} value={w}>
                            <Checkbox checked={pokemonWeaknesses.indexOf(w) > -1} />
                            <ListItemText primary={w} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Paper>
              </Popper>
              <Popper open={isOpen} anchorEl={popperNode}>
                <div
                  {...(isOpen
                    ? getMenuProps({}, { suppressRefError: true })
                    : {})}
                >
                  <Paper
                    square
                    style={{
                      marginTop: 8,
                      width: popperNode ? popperNode.clientWidth : undefined,
                    }}
                  >
                    {getSuggestions(inputValue, {}, suggestions).map(
                      (suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({
                            item: suggestion.label,
                          }),
                          highlightedIndex,
                          selectedItem,
                        })
                    )}
                  </Paper>
                </div>
              </Popper>
            </div>
            {children(inputValue, { weaknesses: pokemonWeaknesses, types: pokemonTypes })}
          </div>
        )
      }}
    </Downshift>
  )
}
