import { Button } from '../../src/components/utils/button.tsx';
import { ReactTestUtils } from '../../src/utils/test/mod.ts';

const reactTests = new ReactTestUtils({
  locale: 'fr',
  withLayout: false,
  timeout: 3000,
});

Deno.test({
  name: 'Button - should be disabled when loading',
  fn: () => {
    console.log('Document:', globalThis.document);
    console.log('Window:', globalThis.window);
    console.log('Body:', globalThis.document.body);
    if (globalThis.document.body) {
      globalThis.document.body.innerHTML = '<div>Hello Deno Test</div>';
      console.log('Body content:', globalThis.document.body.innerHTML);
    }
    // This test should pass if JSDOM is correctly initialized
    console.assert(
      globalThis.document.body != null,
      'Document body should exist',
    );
    const { container } = reactTests.render(
      <Button disabled>Loading Button</Button>,
    );

    const button = container.querySelector('button');
    if (!button?.disabled) {
      throw new Error('Button should be disabled when loading');
    }

    reactTests.cleanup();
  },
});
