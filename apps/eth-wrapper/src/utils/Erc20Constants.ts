export const Erc20 = [
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
    "event Approval(address indexed _owner, address indexed _spender, uint256 _value)"
];

export function getWethAddress(network: string): string {
    return network === "mainnet" ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" :
        "0xc778417E063141139Fce010982780140Aa0cD5Ab";
}
