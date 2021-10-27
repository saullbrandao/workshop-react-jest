import React from 'react'
import { render, screen } from '@testing-library/react'
import PokeballLoading from './PokeballLoading'

describe('PokeballLoading', () => {
  test('should render with default props', () => {
    const defaultSize = 200
    render(<PokeballLoading />)

    const imageEl = screen.getByRole('img')

    expect(imageEl).toBeInTheDocument()
    expect(imageEl.width).toBe(defaultSize)
    expect(imageEl.height).toBe(defaultSize)
  })

  test('should render image with correct size', () => {
    const customSize = 300
    render(<PokeballLoading size={customSize} />)

    const imageEl = screen.getByRole('img')

    expect(imageEl).toBeInTheDocument()
    expect(imageEl.width).toBe(customSize)
    expect(imageEl.height).toBe(customSize)
  })

  test('should render with custom message', () => {
    const customMessage = 'custom message'
    const { rerender } = render(<PokeballLoading />)

    expect(screen.queryByText(customMessage)).not.toBeInTheDocument()

    rerender(<PokeballLoading message={customMessage} />)

    expect(screen.queryByText(customMessage)).toBeInTheDocument()
  })
})
