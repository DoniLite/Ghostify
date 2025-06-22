import {describe, test} from 'bun:test'
import { Button } from '../../src/components/utils/button';
import { ReactTestUtils } from '../../src/utils/test/mod';
import { expect } from 'bun:test';

const reactTests = new ReactTestUtils({
  locale: 'fr',
  withLayout: false,
  timeout: 3000
})

describe('UI Test Suite', () => {
  test('Button test', () => {
    const { container } = reactTests.render(
      <Button disabled={true}>Loading Button</Button>
    )

    const button = container.querySelector('button')
    if (!button?.disabled) {
      throw new Error('Button should be disabled when loading')
    }

    expect(button).toBeInTheDocument()

    reactTests.cleanup()
  });
})