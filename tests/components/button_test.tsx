import { describe, expect, test } from 'bun:test';
import { Button } from '../../src/components/utils/button';
import { ReactTestUtils } from '../../src/utils/test/mod';

const reactTests = new ReactTestUtils({
	locale: 'fr',
	withLayout: false,
	timeout: 3000,
});

describe('UI Test Suite for the Button component', () => {
	test('Accessibility testing', () => {
		const { container } = reactTests.render(
			<Button disabled={true}>Loading Button</Button>,
		);

		const button = container.querySelector('button');
		if (!button?.disabled) {
			throw new Error('Button should be disabled when loading');
		}

		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Loading Button');

		reactTests.cleanup();
	});
});
