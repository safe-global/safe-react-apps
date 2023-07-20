import '@testing-library/jest-dom/extend-expect'

// Jest is not able to use this function from node, which is used at viem v1.3.0
// We need to import it manually
import { TextEncoder } from 'util'

global.TextEncoder = TextEncoder
// END
