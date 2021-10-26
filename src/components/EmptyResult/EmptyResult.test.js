import React from 'react'
import { render, screen } from '@testing-library/react'
import EmptyResult from './EmptyResult'

describe('EmptyResult', () => {
  test('should render with default props', () => {
    render(<EmptyResult />)
    const defaultMessage = 'Oops... Não encontramos nada.'
    const defaultWidth = 200

    const textEl = screen.getByText(defaultMessage)
    const imageEl = screen.getByAltText(/Empty result/i)

    expect(textEl).toBeInTheDocument()
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.width).toBe(defaultWidth)
  })

  test('image should have correct width', () => {
    const customWidth = 300

    render(<EmptyResult width={customWidth} />)

    const imageEl = screen.getByAltText(/Empty result/i)

    expect(imageEl).toBeInTheDocument()
    expect(imageEl.width).toBe(customWidth)
  })

  test('should render with message', () => {
    const customMessage = 'Custom message'

    render(<EmptyResult message={customMessage} />)

    const textEl = screen.getByText(customMessage)

    expect(textEl).toBeInTheDocument()
  })
})
