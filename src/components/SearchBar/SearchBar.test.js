import React from 'react'
import { render, screen } from '@testing-library/react'
import SearchBar from './SearchBar'
import userEvent from '@testing-library/user-event'

jest.useFakeTimers()

describe('SearchBar', () => {
  test('should render with default props', () => {
    render(<SearchBar />)

    const inputEl = screen.getByRole('textbox')
    const buttonEl = screen.getByRole('button')

    expect(inputEl).toBeInTheDocument()
    expect(buttonEl).toBeInTheDocument()
  })

  test('should emit onChange event on input', () => {
    const onChange = jest.fn()
    const defaultInputDelay = 300
    render(<SearchBar onChange={onChange} />)

    const inputEl = screen.getByRole('textbox')
    userEvent.type(inputEl, 'test')

    jest.runTimersToTime(defaultInputDelay)

    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith({ target: inputEl })
  })

  test('should emit onClick event on button', () => {
    const onClick = jest.fn()
    render(<SearchBar onButtonClick={onClick} />)

    const buttonEl = screen.getByRole('button')
    userEvent.click(buttonEl)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
