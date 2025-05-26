import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { detectLocale } from '../src/utils/translation.ts';
import { TranslationProvider } from '../src/components/shared/TranslationContext.tsx';
import Wrapper from '../src/components/shared/Layout.tsx';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const isServerSide = typeof window === 'undefined';
  const defaultLocale = detectLocale();
  return (
    <TranslationProvider
      initialLocale={defaultLocale}
      serverSide={isServerSide}
    >
      <Wrapper>
        {children}
      </Wrapper>
    </TranslationProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
