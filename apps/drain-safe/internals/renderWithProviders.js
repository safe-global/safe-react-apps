import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import { themeMock } from './themeMock';

export default function renderWithProviders(ui) {
  return {
    ...render(<ThemeProvider theme={themeMock}>{ui}</ThemeProvider>),
  };
}
