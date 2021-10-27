import React from 'react'
import { render, screen } from '@testing-library/react'
import PokemonCard from './PokemonCard'
import userEvent from '@testing-library/user-event'
import { cardBuilder } from '../../__mocks__/card-builder'

describe('PokemonCard', () => {
  let card

  beforeEach(() => {
    card = cardBuilder()
  })

  test('should render with default props', () => {
    render(<PokemonCard {...card} />)

    const cardEl = screen.getByRole('img')

    const imageAlt = `${card.id}-${card.name}`

    expect(cardEl).toBeInTheDocument()
    expect(cardEl).toHaveAttribute('src', card.imageUrl)
    expect(cardEl).toHaveAttribute('alt', imageAlt)
  })

  test('should emit onClick event', () => {
    const onClick = jest.fn()

    render(<PokemonCard {...card} onClick={onClick} />)
    const cardEl = screen.getByRole('img')

    userEvent.click(cardEl)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
