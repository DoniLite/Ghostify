// deno-lint-ignore-file
import { Hono } from 'hono'
import { BaseTestConfig } from '../../@types/test.ts'
import { TestAssertions } from './Assertions.ts'
import { MockFactory } from './MockFactory.ts'

export interface ApiTestConfig extends BaseTestConfig {
  baseUrl?: string
  headers?: Record<string, string>
  auth?: {
    type: 'bearer' | 'basic'
    token?: string
    username?: string
    password?: string
  }
}

export class ApiTestUtils {
  private app: Hono
  private config: ApiTestConfig
  private mockDatabase: Map<string, any[]> = new Map()

  constructor(app: Hono, config: ApiTestConfig = {}) {
    this.app = app
    this.config = {
      baseUrl: 'http://localhost:8080',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
      ...config
    }
  }

  private createRequest(method: string, path: string, options: RequestInit = {}): Request {
    const url = `${this.config.baseUrl}${path}`
    const headers = new Headers({
      ...this.config.headers,
      ...options.headers
    })

    // Ajout de l'authentification
    if (this.config.auth) {
      if (this.config.auth.type === 'bearer' && this.config.auth.token) {
        headers.set('Authorization', `Bearer ${this.config.auth.token}`)
      } else if (
        this.config.auth.type === 'basic' &&
        this.config.auth.username &&
        this.config.auth.password
      ) {
        const credentials = btoa(`${this.config.auth.username}:${this.config.auth.password}`)
        headers.set('Authorization', `Basic ${credentials}`)
      }
    }

    return new Request(url, {
      method,
      headers,
      ...options
    })
  }

  /**
   * Méthodes HTTP
   */
  async get(path: string, options: RequestInit = {}): Promise<Response> {
    const request = this.createRequest('GET', path, options)
    return await this.app.fetch(request)
  }

  async post(path: string, data?: any, options: RequestInit = {}): Promise<Response> {
    const request = this.createRequest('POST', path, {
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })
    return await this.app.fetch(request)
  }

  async put(path: string, data?: any, options: RequestInit = {}): Promise<Response> {
    const request = this.createRequest('PUT', path, {
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })
    return await this.app.fetch(request)
  }

  async delete(path: string, options: RequestInit = {}): Promise<Response> {
    const request = this.createRequest('DELETE', path, options)
    return await this.app.fetch(request)
  }

  async patch(path: string, data?: any, options: RequestInit = {}): Promise<Response> {
    const request = this.createRequest('PATCH', path, {
      body: data ? JSON.stringify(data) : undefined,
      ...options
    })
    return await this.app.fetch(request)
  }

  /**
   * Assertions pour les réponses
   */
  expectStatus(response: Response, expectedStatus: number): void {
    TestAssertions.assertEqual(
      response.status,
      expectedStatus,
      `Expected status ${expectedStatus}, got ${response.status}`
    )
  }

  async expectJsonResponse(response: Response, expectedData?: any): Promise<any> {
    const contentType = response.headers.get('content-type')
    TestAssertions.assertTrue(
      contentType?.includes('application/json') || false,
      'Expected JSON content type'
    )

    const data = await response.json()

    if (expectedData !== undefined) {
      TestAssertions.assertDeepEqual(data, expectedData)
    }

    return data
  }

  expectHeaders(response: Response, expectedHeaders: Record<string, string>): void {
    Object.entries(expectedHeaders).forEach(([key, expectedValue]) => {
      const actualValue = response.headers.get(key)
      TestAssertions.assertEqual(
        actualValue,
        expectedValue,
        `Expected header ${key} to be ${expectedValue}, got ${actualValue}`
      )
    })
  }

  /**
   * Mock de base de données en mémoire
   */
  mockDatabaseFn<T extends { id?: any }>(
    tableName: string,
    initialData: T[] = []
  ): {
    find: (id: any) => T | undefined
    findAll: () => T[]
    create: (item: Omit<T, 'id'>) => T
    update: (id: any, updates: Partial<T>) => T | null
    delete: (id: any) => T | null
    reset: () => void
  } {
    const data = [...initialData]
    this.mockDatabase.set(tableName, data)

    return {
      find: (id: any) => data.find((item: any) => item.id === id),

      findAll: () => [...data],

      create: (newItem: Omit<T, 'id'>) => {
        const item = { ...newItem, id: Date.now() } as T
        data.push(item)
        return item
      },

      update: (id: any, updates: Partial<T>) => {
        const index = data.findIndex((item: any) => item.id === id)
        if (index >= 0) {
          data[index] = { ...data[index], ...updates }
          return data[index]
        }
        return null
      },

      delete: (id: any) => {
        const index = data.findIndex((item: any) => item.id === id)
        if (index >= 0) {
          return data.splice(index, 1)[0]
        }
        return null
      },

      reset: () => {
        data.length = 0
        data.push(...initialData)
      }
    }
  }

  /**
   * Test des middlewares
   */
  async testMiddleware(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    expectedEffect: (response: Response) => void | Promise<void>
  ): Promise<void> {
    const methodName = method.toLowerCase() as keyof ApiTestUtils
    const response = await (this[methodName] as Function)(path)
    await expectedEffect(response)
  }

  /**
   * Test de performance basique
   */
  async testPerformance(
    requests: Array<() => Promise<Response>>,
    maxDurationMs: number = 1000
  ): Promise<void> {
    const startTime = performance.now()

    await Promise.all(requests.map((req) => req()))

    const duration = performance.now() - startTime
    TestAssertions.assertTrue(
      duration <= maxDurationMs,
      `Expected requests to complete within ${maxDurationMs}ms, took ${duration.toFixed(2)}ms`
    )
  }

  /**
   * Nettoyage
   */
  cleanup(): void {
    this.mockDatabase.clear()
    MockFactory.resetAll()
  }
}
