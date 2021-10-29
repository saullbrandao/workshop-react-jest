import { orderBy } from 'lodash'
import { combineReducers, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import axiosMock from '../../__mocks__/axios-mock'
import { cardBuilder } from '../../__mocks__/card-builder'
import { cardStateBuilder } from '../../__mocks__/card-state-builder'
import { arrayToObject, getArrayIds } from '../../__mocks__/utils'
import cardStore from '../card.store'

describe('Card Store', () => {
  let store
  let initialCardsState

  beforeEach(() => {
    jest.clearAllMocks()

    initialCardsState = cardStateBuilder()

    store = createStore(
      combineReducers({
        card: cardStore.reducer,
      }),
      {
        card: initialCardsState,
      },
      applyMiddleware(thunk),
    )
  })

  test('should have correct initial state', () => {
    expect(store.getState()).toEqual({ card: initialCardsState })
  })

  test('should dispatch getCards', async () => {
    const card = cardBuilder()

    axiosMock.get.mockResolvedValue({
      data: {
        cards: [card],
      },
    })

    await store.dispatch(cardStore.actions.getCards({ query: '' }))

    const currentState = store.getState()

    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith(
      '/cards?page=1&name=&pageSize=27',
    )
    expect(currentState.card).toEqual({
      ...initialCardsState,
      cards: arrayToObject([card]),
      ids: getArrayIds([card]),
      query: '',
    })
  })

  test('should dispatch nextCard', async () => {
    const card = cardBuilder({ name: 'PokeTest' })
    const query = 'test'

    store.dispatch(cardStore.actions.setQuery({ query }))

    axiosMock.get.mockResolvedValue({
      data: {
        cards: [card],
      },
    })

    await store.dispatch(cardStore.actions.nextCards())

    const currentState = store.getState()

    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith(
      `/cards?page=2&name=${query}&pageSize=27`,
    )
    expect(currentState.card).toEqual({
      ...initialCardsState,
      query,
      page: 2,
      cards: { ...initialCardsState.cards, [card.id]: card },
      ids: [...initialCardsState.ids, card.id],
    })
  })

  test('should dispatch setPage', () => {
    const page = 2020

    store.dispatch(cardStore.actions.setPage({ page }))

    const currentState = store.getState()

    expect(currentState.card.page).toBe(page)
  })

  test('should dispatch setQuery', () => {
    const query = 'test'

    store.dispatch(cardStore.actions.setQuery({ query }))

    const currentState = store.getState()

    expect(currentState.card.query).toBe(query)
  })

  test('should dispatch setLoading', () => {
    const loading = true

    store.dispatch(cardStore.actions.setLoading({ loading }))

    const currentState = store.getState()

    expect(currentState.card.loading).toBe(loading)
  })

  test('should select cards', () => {
    const cards = cardStore.selectors.cards({ card: initialCardsState })

    expect(cards).toEqual(
      orderBy(Object.values(initialCardsState.cards), ['name']),
    )
  })

  test('should select loading', () => {
    const loading = cardStore.selectors.loading({ card: initialCardsState })

    expect(loading).toBe(false)
  })
})
