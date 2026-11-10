import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  it('muestra el titulo y el mensaje sobre el despliegue con IA', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Infraestructura para el desarrollo continuo' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/ayuda de IA \(Claude\)/)).toBeInTheDocument()
  })

  it('el contador aumenta al hacer clic', async () => {
    const user = userEvent.setup()
    render(<App />)

    const boton = screen.getByRole('button', { name: /count is 0/i })
    await user.click(boton)
    await user.click(boton)

    expect(screen.getByRole('button', { name: /count is 2/i })).toBeInTheDocument()
  })

  it('el boton de la API muestra el nombre y el mensaje del Worker', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        name: 'Cloudflare',
        message: 'Hola desde un Cloudflare Worker!',
        time: '2026-09-27T12:00:00.000Z',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    expect(screen.getByRole('button', { name: 'get name' })).toHaveTextContent('unknown')

    await user.click(screen.getByRole('button', { name: 'get name' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'get name' })).toHaveTextContent('Cloudflare'),
    )
    expect(fetchMock).toHaveBeenCalledWith('/api/')
    expect(screen.getByText(/Hola desde un Cloudflare Worker!/)).toBeInTheDocument()
  })
})
