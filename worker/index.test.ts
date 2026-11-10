// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import worker from './index.ts'

type Nota = { id: number; texto: string; creado_en: string }

// D1 falso: imita env.DB.prepare(sql).all() sin necesitar Cloudflare.
function fakeEnv(rows: Nota[] = []) {
  const all = vi.fn().mockResolvedValue({ results: rows })
  const prepare = vi.fn().mockReturnValue({ all })
  return { env: { DB: { prepare } } as unknown as Env, prepare, all }
}

function get(path: string, env: Env) {
  return worker.fetch(new Request(`https://example.com${path}`) as never, env)
}

describe('Worker', () => {
  it('GET /api/ responde el saludo en JSON', async () => {
    const { env } = fakeEnv()
    const res = await get('/api/', env)
    const body = (await res.json()) as { name: string; message: string; time: string }

    expect(res.status).toBe(200)
    expect(body.name).toBe('Cloudflare')
    expect(body.message).toBe('Hola desde un Cloudflare Worker!')
    expect(Number.isNaN(Date.parse(body.time))).toBe(false)
  })

  it('GET /api/db lee la tabla notas de D1', async () => {
    const rows: Nota[] = [
      { id: 1, texto: 'Primer registro creado para la tarea de D1', creado_en: '2026-09-27 00:00:00' },
    ]
    const { env, prepare } = fakeEnv(rows)
    const res = await get('/api/db', env)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ notas: rows })
    expect(prepare).toHaveBeenCalledWith('SELECT * FROM notas')
  })

  it('GET /api/db con la tabla vacia responde una lista vacia', async () => {
    const { env } = fakeEnv([])
    const res = await get('/api/db', env)
    expect(await res.json()).toEqual({ notas: [] })
  })

  it('una ruta desconocida responde 404', async () => {
    const { env, prepare } = fakeEnv()
    const res = await get('/no-existe', env)

    expect(res.status).toBe(404)
    expect(prepare).not.toHaveBeenCalled()
  })
})
