import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import theme from '../src/components/theme';

addDecorator(storyFn => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
));