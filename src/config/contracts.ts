// ─── ABIs ────────────────────────────────────────────────────────────────────

export const ERC20_ABI = [
  { inputs: [], name: 'name', outputs: [{ type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'symbol', outputs: [{ type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'decimals', outputs: [{ type: 'uint8' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'transfer', outputs: [{ type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'transferFrom', outputs: [{ type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
] as const;

export const UNISWAP_V2_FACTORY_ABI = [
  { inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }], name: 'getPair', outputs: [{ name: 'pair', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: '', type: 'uint256' }], name: 'allPairs', outputs: [{ name: 'pair', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'allPairsLength', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }], name: 'createPair', outputs: [{ name: 'pair', type: 'address' }], stateMutability: 'nonpayable', type: 'function' },
] as const;

export const UNISWAP_V2_ROUTER_ABI = [
  { inputs: [], name: 'WETH', outputs: [{ type: 'address' }], stateMutability: 'pure', type: 'function' },
  { inputs: [], name: 'factory', outputs: [{ type: 'address' }], stateMutability: 'pure', type: 'function' },
  {
    inputs: [{ name: 'amountIn', type: 'uint256' }, { name: 'amountOutMin', type: 'uint256' }, { name: 'path', type: 'address[]' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'swapExactTokensForTokens', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'amountOutMin', type: 'uint256' }, { name: 'path', type: 'address[]' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'swapExactETHForTokens', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'payable', type: 'function',
  },
  {
    inputs: [{ name: 'amountIn', type: 'uint256' }, { name: 'amountOutMin', type: 'uint256' }, { name: 'path', type: 'address[]' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'swapExactTokensForETH', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }, { name: 'amountADesired', type: 'uint256' }, { name: 'amountBDesired', type: 'uint256' }, { name: 'amountAMin', type: 'uint256' }, { name: 'amountBMin', type: 'uint256' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'addLiquidity', outputs: [{ name: 'amountA', type: 'uint256' }, { name: 'amountB', type: 'uint256' }, { name: 'liquidity', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'token', type: 'address' }, { name: 'amountTokenDesired', type: 'uint256' }, { name: 'amountTokenMin', type: 'uint256' }, { name: 'amountETHMin', type: 'uint256' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'addLiquidityETH', outputs: [{ name: 'amountToken', type: 'uint256' }, { name: 'amountETH', type: 'uint256' }, { name: 'liquidity', type: 'uint256' }], stateMutability: 'payable', type: 'function',
  },
  {
    inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }, { name: 'liquidity', type: 'uint256' }, { name: 'amountAMin', type: 'uint256' }, { name: 'amountBMin', type: 'uint256' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'removeLiquidity', outputs: [{ name: 'amountA', type: 'uint256' }, { name: 'amountB', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'token', type: 'address' }, { name: 'liquidity', type: 'uint256' }, { name: 'amountTokenMin', type: 'uint256' }, { name: 'amountETHMin', type: 'uint256' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'removeLiquidityETH', outputs: [{ name: 'amountToken', type: 'uint256' }, { name: 'amountETH', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'amountIn', type: 'uint256' }, { name: 'path', type: 'address[]' }],
    name: 'getAmountsOut', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'view', type: 'function',
  },
  {
    inputs: [{ name: 'amountOut', type: 'uint256' }, { name: 'path', type: 'address[]' }],
    name: 'getAmountsIn', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'view', type: 'function',
  },
] as const;

export const UNISWAP_V2_PAIR_ABI = [
  { inputs: [], name: 'token0', outputs: [{ type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'token1', outputs: [{ type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'getReserves', outputs: [{ name: 'reserve0', type: 'uint112' }, { name: 'reserve1', type: 'uint112' }, { name: 'blockTimestampLast', type: 'uint32' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;

// ─── Contract Addresses & Types — re-exported from the combined chains config ─
export type { NetworkContracts } from './chains';
export { CONTRACTS } from './chains';

// ─── SimpleERC20 deployment artifact ─────────────────────────────────────────
// Compiled from src/contracts/SimpleERC20.sol   solc 0.8.22  optimizer 200 runs
// Constructor: (string _name, string _symbol, uint8 _decimals, uint256 _totalSupply)
// _totalSupply must already be scaled (i.e. amount * 10**decimals)
export const SIMPLE_ERC20_DEPLOY_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name',        type: 'string'  },
      { name: '_symbol',      type: 'string'  },
      { name: '_decimals',    type: 'uint8'   },
      { name: '_totalSupply', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
] as const;

export const SIMPLE_ERC20_BYTECODE =
  '0x608060405234801561000f575f5ffd5b506040516108e13803806108e183398101604081905261002e91610144565b5f6100398582610256565b5060016100468482610256565b506002805460ff191660ff84161790556003819055335f818152600460209081526040808320859055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a350505050610314565b634e487b7160e01b5f52604160045260245ffd5b5f82601f8301126100ca575f5ffd5b81516001600160401b038111156100e3576100e36100a7565b604051601f8201601f19908116603f011681016001600160401b0381118282101715610111576101116100a7565b604052818152838201602001851015610128575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f5f60808587031215610157575f5ffd5b84516001600160401b0381111561016c575f5ffd5b610178878288016100bb565b602087015190955090506001600160401b03811115610195575f5ffd5b6101a1878288016100bb565b935050604085015160ff811681146101b7575f5ffd5b6060959095015193969295505050565b600181811c908216806101db57607f821691505b6020821081036101f957634e487b7160e01b5f52602260045260245ffd5b50919050565b601f821115610251578282111561025157805f5260205f20601f840160051c602085101561022a57505f5b90810190601f840160051c035f5b8181101561024d575f83820155600101610238565b5050505b505050565b81516001600160401b0381111561026f5761026f6100a7565b6102838161027d84546101c7565b846101ff565b6020601f8211600181146102b5575f831561029e5750848201515b5f19600385901b1c1916600184901b17845561030d565b5f84815260208120601f198516915b828110156102e457878501518255602094850194600190920191016102c4565b508482101561030157868401515f19600387901b60f8161c191681555b505060018360011b0184555b5050505050565b6105c0806103215f395ff3fe608060405234801561000f575f5ffd5b5060043610610090575f3560e01c8063313ce56711610063578063313ce567146100ff57806370a082311461011e57806395d89b411461013d578063a9059cbb14610145578063dd62ed3e14610158575f5ffd5b806306fdde0314610094578063095ea7b3146100b257806318160ddd146100d557806323b872dd146100ec575b5f5ffd5b61009c610182565b6040516100a99190610430565b60405180910390f35b6100c56100c0366004610480565b61020d565b60405190151581526020016100a9565b6100de60035481565b6040519081526020016100a9565b6100c56100fa3660046104a8565b610279565b60025461010c9060ff1681565b60405160ff90911681526020016100a9565b6100de61012c3660046104e2565b60046020525f908152604090205481565b61009c6102e8565b6100c5610153366004610480565b6102f5565b6100de610166366004610502565b600560209081525f928352604080842090915290825290205481565b5f805461018e90610533565b80601f01602080910402602001604051908101604052809291908181526020018280546101ba90610533565b80156102055780601f106101dc57610100808354040283529160200191610205565b820191905f5260205f20905b8154815290600101906020018083116101e857829003601f168201915b505050505081565b335f8181526005602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906102679086815260200190565b60405180910390a35060015b92915050565b6001600160a01b0383165f9081526005602090815260408083203384529091528120545f1981146102d2576102ae838261056b565b6001600160a01b0386165f9081526005602090815260408083203384529091529020555b6102dd85858561030a565b506001949350505050565b6001805461018e90610533565b5f61030133848461030a565b50600192915050565b6001600160a01b03821661035b5760405162461bcd60e51b815260206004820152601360248201527245524332303a207a65726f206164647265737360681b60448201526064015b60405180910390fd5b6001600160a01b0383165f908152600460205260409020548111156103c25760405162461bcd60e51b815260206004820152601b60248201527f45524332303a20696e73756666696369656e742062616c616e636500000000006044820152606401610352565b6001600160a01b038084165f81815260046020526040808220805486900390559285168082529083902080548501905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906104239085815260200190565b60405180910390a3505050565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b038116811461047b575f5ffd5b919050565b5f5f60408385031215610491575f5ffd5b61049a83610465565b946020939093013593505050565b5f5f5f606084860312156104ba575f5ffd5b6104c384610465565b92506104d160208501610465565b929592945050506040919091013590565b5f602082840312156104f2575f5ffd5b6104fb82610465565b9392505050565b5f5f60408385031215610513575f5ffd5b61051c83610465565b915061052a60208401610465565b90509250929050565b600181811c9082168061054757607f821691505b60208210810361056557634e487b7160e01b5f52602260045260245ffd5b50919050565b8181038181111561027357634e487b7160e01b5f52601160045260245ffdfea2646970667358221220668246784446e85a58ef2422163972062d51cebc8a2b2b39c7e94d047cb3192964736f6c63430008220033' as const;
