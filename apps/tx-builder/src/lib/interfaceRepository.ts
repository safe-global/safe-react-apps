import { ChainInfo } from '@gnosis.pm/safe-apps-sdk'
import { ContractInterface } from '../typings/models'
import getAbi from './getAbi'

class InterfaceRepository {
  chainInfo: ChainInfo

  constructor(chainInfo: ChainInfo) {
    this.chainInfo = chainInfo
  }

  private _isMethodPayable = (m: any) => m.payable || m.stateMutability === 'payable'

  async loadAbi(address: string): Promise<string | null> {
    const abi = await getAbi(address, this.chainInfo)

    return abi ? abi : null
  }

  getMethods(abi: string): ContractInterface {
    let parsedAbi

    try {
      parsedAbi = JSON.parse(abi)
    } catch {
      return { methods: [] }
    }

    if (!Array.isArray(parsedAbi)) {
      return { methods: [] }
    }

    const methods = parsedAbi
      .filter((e: any) => {
        if (Object.keys(e).length === 0) {
          return false
        }

        if (['pure', 'view'].includes(e.stateMutability)) {
          return false
        }

        if (e?.type?.toLowerCase() === 'event') {
          return false
        }

        return !e.constant
      })
      .filter((m: any) => m.type !== 'constructor')
      .map((m: any) => {
        return {
          inputs: m.inputs || [],
          name: m.name || (m.type === 'fallback' ? 'fallback' : 'receive'),
          payable: this._isMethodPayable(m),
        }
      })

    return { methods }
  }
}

export type InterfaceRepo = InstanceType<typeof InterfaceRepository>

export default InterfaceRepository
