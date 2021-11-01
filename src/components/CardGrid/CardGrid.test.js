import React from 'react'
import { render, screen } from '@testing-library/react'

import CardGrid from '../CardGrid'
import { bulbasaurMock, pikachuMock } from '../../__mocks__/card-builder'
import {
  DeckFormProviderMock,
  mockedContext,
} from '../../__mocks__/deck-form-provider-mock'
import userEvent from '@testing-library/user-event'

const setup = ({ cards = [], loading = false }) => {
  const renderResult = render(
    <DeckFormProviderMock>
      <CardGrid cards={cards} loading={loading} />
    </DeckFormProviderMock>,
  )

  return {
    ...renderResult,
    ...mockedContext,
  }
}

describe('CardGrid', () => {
  test('should render with default props', () => {
    const { container } = setup({})

    expect(screen.getByAltText('Empty Result')).toBeInTheDocument()
    expect(
      screen.getByText('Oops... Não encontramos nada.'),
    ).toBeInTheDocument()
    expect(container).toBeInTheDocument()
  })

  test('should render cards', () => {
    const cards = [pikachuMock, bulbasaurMock]
    setup({ cards })

    cards.forEach(card => {
      expect(screen.getByAltText(`${card.id}-${card.name}`)).toBeInTheDocument()
    })
  })

  test('should add card', () => {
    const cards = [pikachuMock, bulbasaurMock]
    const { addCard } = setup({ cards })

    const pikachu = screen.getByAltText(`${pikachuMock.id}-${pikachuMock.name}`)

    userEvent.click(pikachu)

    expect(addCard).toHaveBeenCalledWith(pikachuMock)
  })
})
