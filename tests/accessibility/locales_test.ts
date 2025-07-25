import { describe, it } from 'bun:test';
import { TestAssertions } from '@/utils/test/mod';
import en from '../../locales/en';
import es from '../../locales/es';
import fr from '../../locales/fr';
import { getKeyPaths } from './locales.utils';

describe('getKeyPaths', () => {
	it('should return all key paths of a nested en locales', () => {
		const result = getKeyPaths(en);
		TestAssertions.assertFalse(
			result.length === 0,
			'Result should not be empty',
		);
	});

	it('should return all key paths of a nested fr locales', () => {
		const result = getKeyPaths(fr);
		TestAssertions.assertFalse(
			result.length === 0,
			'Result should not be empty',
		);
	});
	it('should return all key paths of a nested es locales', () => {
		const result = getKeyPaths(es);
		TestAssertions.assertFalse(
			result.length === 0,
			'Result should not be empty',
		);
	});
	it('should return all key paths of a nested locales', () => {
		const result = getKeyPaths({ en, fr, es });
		TestAssertions.assertFalse(
			result.length === 0,
			'Result should not be empty',
		);
	});

	it('should compare the fr and the en locales to ensure they have the same keys', () => {
		const frKeys = getKeyPaths(fr);
		const enKeys = getKeyPaths(en);
		TestAssertions.assertTrue(
			frKeys.length === enKeys.length &&
				frKeys.every((key) => enKeys.includes(key)),
			'French and English locales should have the same keys',
		);
	});
	it('should compare the es and the en locales to ensure they have the same keys', () => {
		const esKeys = getKeyPaths(es);
		const enKeys = getKeyPaths(en);
		TestAssertions.assertTrue(
			esKeys.length === enKeys.length &&
				esKeys.every((key) => enKeys.includes(key)),
			'Spanish and English locales should have the same keys',
		);
	});
	it('should compare the fr and the es locales to ensure they have the same keys', () => {
		const frKeys = getKeyPaths(fr);
		const esKeys = getKeyPaths(es);
		TestAssertions.assertTrue(
			frKeys.length === esKeys.length &&
				frKeys.every((key) => esKeys.includes(key)),
			'French and Spanish locales should have the same keys',
		);
	});
});
