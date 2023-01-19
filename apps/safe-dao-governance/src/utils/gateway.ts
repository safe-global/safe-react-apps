import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'

const replaceTemplate = (uri: string, data: Record<string, string>): string => {
  // Template syntax returned from gateway is {{this}}
  const TEMPLATE_REGEX = /\{\{([^}]+)\}\}/g

  return uri.replace(TEMPLATE_REGEX, (_, key: string) => data[key])
}

export const getHashedExplorerUrl = (
  hash: string,
  blockExplorerUriTemplate: ChainInfo['blockExplorerUriTemplate'],
): string => {
  const isTx = hash.length > 42
  const param = isTx ? 'txHash' : 'address'

  return replaceTemplate(blockExplorerUriTemplate[param], { [param]: hash })
}
