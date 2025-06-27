// deno-lint-ignore-file no-explicit-any
import { MockFunction } from '../../@types/test.ts'

export class MockFactory {
  private static mocks = new Map<string, any>()

  static createMock<T extends (...args: any[]) => any>(name?: string): MockFunction<T> {
    const calls: Array<Parameters<T>> = []
    const results: Array<ReturnType<T>> = []

    const mockFn = ((...args: Parameters<T>): ReturnType<T> => {
      calls.push(args)
      const result = undefined as ReturnType<T>
      results.push(result)
      return result
    }) as MockFunction<T>

    mockFn.calls = calls
    mockFn.results = results

    Object.defineProperty(mockFn, 'callCount', {
      get: () => calls.length
    })

    mockFn.reset = () => {
      calls.length = 0
      results.length = 0
    }

    if (name) {
      this.mocks.set(name, mockFn)
    }

    return mockFn
  }

  static getMock<T extends (...args: any[]) => any>(name: string): MockFunction<T> | undefined {
    return this.mocks.get(name)
  }

  static resetAll(): void {
    this.mocks.forEach((mock) => mock.reset())
  }

  static clearAll(): void {
    this.mocks.clear()
  }
}
