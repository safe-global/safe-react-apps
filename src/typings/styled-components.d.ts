import 'styled-components'

import { Theme } from '../components/theme';


declare module "styled-components" {
  /* tslint:disable */
  export interface DefaultTheme extends Theme {}
}
