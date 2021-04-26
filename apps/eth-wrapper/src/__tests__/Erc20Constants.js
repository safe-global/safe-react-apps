import { getWethAddress } from "../utils/Erc20Constants"

describe('WETH Contract addresses', () =>{

    describe('WETH address in mainnet' , () => {
        it('returns the ethereum address', ()=>{
            let address = getWethAddress("mainnet");
            expect(address).toStrictEqual("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
        })
    })
    
    describe('WETH address in mainnet with irregular casing' , () => {
        it('returns the ethereum address', ()=>{
            let address = getWethAddress("MaInNeT");
            expect(address).toStrictEqual("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
        })
    })

    describe('WETH address in rinkeby' , () => {
        it('returns the ethereum address', ()=>{
            let address = getWethAddress("rinkey");
            expect(address).toStrictEqual("0xc778417E063141139Fce010982780140Aa0cD5Ab");
        })
    })

    describe('WETH address unknown net defaults to rinkeby address' , () => {
        it('returns the ethereum address', ()=>{
            let address = getWethAddress("goerli");
            expect(address).toStrictEqual("0xc778417E063141139Fce010982780140Aa0cD5Ab");
        })
    })
})