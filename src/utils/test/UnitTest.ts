// deno-lint-ignore-file no-explicit-any
import { BaseTestConfig, MockFunction } from '../../@types/test.ts';
import { TestAssertions } from './Assertions.ts';
import { MockFactory } from './MockFactory.ts';


export interface UnitTestConfig extends BaseTestConfig {
  mockGlobals?: string[];
  verbose?: boolean;
}

export class UnitTestUtils {
  private config: UnitTestConfig;
  private originalGlobals: Map<string, any> = new Map();

  constructor(config: UnitTestConfig = {}) {
    this.config = {
      timeout: 1000,
      verbose: false,
      ...config
    };
  }

  /**
   * Test de fonctions pures avec plusieurs cas de test
   */
  testPureFunction<T extends (...args: any[]) => any>(
    fn: T,
    testCases: Array<{
      input: Parameters<T>;
      expected: ReturnType<T>;
      description?: string;
    }>
  ): void {
    testCases.forEach(({ input, expected, description }, index) => {
      const result = fn(...input);
      
      TestAssertions.assertDeepEqual(
        result,
        expected,
        description || `Test case ${index + 1} failed`
      );
      
      if (this.config.verbose && description) {
        console.log(`✓ ${description}`);
      }
    });
  }

  /**
   * Test de fonctions asynchrones
   */
  async testAsyncFunction<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    testCases: Array<{
      input: Parameters<T>;
      expected?: Awaited<ReturnType<T>>;
      shouldReject?: boolean;
      errorMessage?: string;
      description?: string;
    }>
  ): Promise<void> {
    for (const { input, expected, shouldReject, errorMessage, description } of testCases) {
      if (shouldReject) {
        await TestAssertions.assertRejects(
          () => fn(...input),
          errorMessage,
          description
        );
      } else {
        const result = await fn(...input);
        if (expected !== undefined) {
          TestAssertions.assertDeepEqual(
            result,
            expected,
            description || 'Async function test failed'
          );
        }
      }
      
      if (this.config.verbose && description) {
        console.log(`✓ ${description}`);
      }
    }
  }

  /**
   * Test de classes avec leurs méthodes et propriétés
   */
  testClass<T>(
    ClassConstructor: new (...args: any[]) => T,
    config: {
      constructorArgs?: any[];
      methods?: Array<{
        name: keyof T;
        args: any[];
        expected?: any;
        shouldThrow?: boolean;
        errorMessage?: string;
      }>;
      properties?: Array<{
        name: keyof T;
        expected: any;
      }>;
    }
  ): T {
    const instance = new ClassConstructor(...(config.constructorArgs || []));

    // Test des propriétés
    config.properties?.forEach(({ name, expected }) => {
      TestAssertions.assertDeepEqual(
        instance[name],
        expected,
        `Property ${String(name)} test failed`
      );
    });

    // Test des méthodes
    config.methods?.forEach(({ name, args, expected, shouldThrow, errorMessage }) => {
      const method = instance[name] as any;
      
      if (shouldThrow) {
        TestAssertions.assertThrows(
          () => method.apply(instance, args),
          errorMessage,
          `Method ${String(name)} should throw`
        );
      } else if (expected !== undefined) {
        const result = method.apply(instance, args);
        TestAssertions.assertDeepEqual(
          result,
          expected,
          `Method ${String(name)} test failed`
        );
      }
    });

    return instance;
  }

  /**
   * Création de mocks typés
   */
  createMock<T extends (...args: any[]) => any>(name?: string): MockFunction<T> {
    return MockFactory.createMock<T>(name);
  }

  /**
   * Mock des globales (console, fetch, etc.)
   */
  mockGlobal<T>(name: string, mockValue: T): () => void {
    if (!this.originalGlobals.has(name)) {
      this.originalGlobals.set(name, (globalThis as any)[name]);
    }
    
    (globalThis as any)[name] = mockValue;
    
    // Retourne une fonction pour restaurer
    return () => {
      const original = this.originalGlobals.get(name);
      if (original !== undefined) {
        (globalThis as any)[name] = original;
      } else {
        delete (globalThis as any)[name];
      }
    };
  }

  /**
   * Test de performance d'une fonction
   */
  async testPerformance<T extends (...args: any[]) => any>(
    fn: T,
    args: Parameters<T>,
    options: {
      iterations?: number;
      maxTimeMs?: number;
      warmupIterations?: number;
    } = {}
  ): Promise<{ avgTime: number; minTime: number; maxTime: number }> {
    const { iterations = 100, maxTimeMs = 1000, warmupIterations = 10 } = options;
    
    // Warm-up
    for (let i = 0; i < warmupIterations; i++) {
      await fn(...args);
    }
    
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn(...args);
      const end = performance.now();
      times.push(end - start);
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    TestAssertions.assertTrue(
      avgTime <= maxTimeMs,
      `Function too slow: avg ${avgTime.toFixed(2)}ms > ${maxTimeMs}ms`
    );
    
    return { avgTime, minTime, maxTime };
  }

  /**
   * Nettoyage après les tests
   */
  cleanup(): void {
    // Restauration des globales
    this.originalGlobals.forEach((original, name) => {
      (globalThis as any)[name] = original;
    });
    this.originalGlobals.clear();
    
    MockFactory.clearAll();
  }
}