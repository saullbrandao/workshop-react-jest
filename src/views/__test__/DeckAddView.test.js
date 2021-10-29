import React from 'react'
import { screen, render, wait } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import axiosMock from '../../__mocks__/axios-mock'

import DeckAddView from '../DeckAddView'
import cardStore from '../../store/card.store'
import { pikachuMock, squirtleMock } from '../../__mocks__/card-builder'
import { storeBuilder } from '../../__mocks__/store-builder'
import userEvent from '@testing-library/user-event'

jest.useFakeTimers()

const setup = () => {
  jest.clearAllMocks()

  const store = storeBuilder()

  const renderResult = render(
    <Provider store={store}>
      <MemoryRouter>
        <Route path={'/'} component={DeckAddView} />
      </MemoryRouter>
    </Provider>,
  )

  return {
    ...renderResult,
    store,
    inputEl: screen.getByPlaceholderText('Pesquise...'),
    buttonEl: screen.getByText('Salvar Baralho'),
  }
}

describe('DeckAddView', () => {
  const mockCardsResponse = (cards = []) => {
    axiosMock.get.mockResolvedValue({
      data: {
        cards,
      },
    })
  }

  test('should render with default props', async () => {
    mockCardsResponse()
    const { inputEl, buttonEl } = setup()

    await wait(undefined, { timeout: 0 })

    expect(inputEl).toBeInTheDocument()
    expect(buttonEl).toBeInTheDocument()
  })

  test('should render with cards', async () => {
    const cards = [pikachuMock, squirtleMock]

    mockCardsResponse(cards)

    setup()

    await wait(undefined, { timeout: 0 })

    cards.forEach(card => {
      expect(screen.getByAltText(`${card.id}-${card.name}`)).toBeInTheDocument()
    })
  })

  test('should render loading', () => {
    mockCardsResponse()

    const { store } = setup()

    store.dispatch(cardStore.actions.setLoading({ loading: true }))

    expect(screen.getByAltText('Pokeball Loading')).toBeInTheDocument()
  })

  test('should render empty result', async () => {
    mockCardsResponse()

    setup()

    await wait(undefined, { timeout: 0 })

    expect(screen.getByAltText('Empty Result')).toBeInTheDocument()
  })

  test('should search', async () => {
    mockCardsResponse()

    const { inputEl } = setup()

    userEvent.type(inputEl, 'picles')

    jest.runAllTimers()

    expect(axiosMock.get).toBeCalledTimes(2)
    expect(axiosMock.get).toBeCalledWith(
      '/cards?page=1&name=picles&pageSize=27',
    )
  })
})
