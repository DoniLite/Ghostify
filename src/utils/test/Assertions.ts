// deno-lint-ignore-file no-explicit-any
export class TestAssertions {
	static assertEqual<T>(actual: T, expected: T, message?: string): void {
		if (actual !== expected) {
			throw new Error(message || `Expected ${expected}, but got ${actual}`);
		}
	}

	static assertNotEquals<T>(actual: T, expected: T, message?: string): void {
		if (actual === expected) {
			throw new Error(message || `Expected not ${expected}, but got ${actual}`);
		}
	}

	static assertDeepEqual<T>(actual: T, expected: T, message?: string): void {
		const actualStr = JSON.stringify(actual);
		const expectedStr = JSON.stringify(expected);

		if (actualStr !== expectedStr) {
			throw new Error(
				message || `Expected ${expectedStr}, but got ${actualStr}`,
			);
		}
	}

	static assertTrue(condition: boolean, message?: string): void {
		if (!condition) {
			throw new Error(message || 'Expected condition to be true');
		}
	}

	static assertFalse(condition: boolean, message?: string): void {
		if (condition) {
			throw new Error(message || 'Expected condition to be false');
		}
	}

	static assertThrows(
		fn: () => any,
		expectedError?: string | RegExp | Error,
		message?: string,
	): void {
		let thrown = false;
		let actualError: any;

		try {
			fn();
		} catch (error) {
			thrown = true;
			actualError = error;
		}

		if (!thrown) {
			throw new Error(message || 'Expected function to throw');
		}

		if (expectedError) {
			if (typeof expectedError === 'string') {
				TestAssertions.assertTrue(
					actualError.message.includes(expectedError),
					`Expected error message to contain "${expectedError}"`,
				);
			} else if (expectedError instanceof RegExp) {
				TestAssertions.assertTrue(
					expectedError.test(actualError.message),
					`Expected error message to match ${expectedError}`,
				);
			} else if (expectedError instanceof Error) {
				TestAssertions.assertEqual(
					actualError.constructor,
					expectedError.constructor,
					'Expected same error type',
				);
			}
		}
	}

	static async assertRejects(
		fn: () => Promise<any>,
		expectedError?: string | RegExp | Error,
		message?: string,
	): Promise<void> {
		let thrown = false;
		let actualError: any;

		try {
			await fn();
		} catch (error) {
			thrown = true;
			actualError = error;
		}

		if (!thrown) {
			throw new Error(message || 'Expected async function to reject');
		}

		if (expectedError) {
			if (typeof expectedError === 'string') {
				TestAssertions.assertTrue(
					actualError.message.includes(expectedError),
					`Expected error message to contain "${expectedError}"`,
				);
			} else if (expectedError instanceof RegExp) {
				TestAssertions.assertTrue(
					expectedError.test(actualError.message),
					`Expected error message to match ${expectedError}`,
				);
			}
		}
	}
}
