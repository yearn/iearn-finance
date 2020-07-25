import config from "../config";
import async from 'async';
import * as moment from 'moment';
import {
  ERROR,
  CONNECT_LEDGER,
  CONNECT_METAMASK,
  CONNECT_METAMASK_PASSIVE,
  GET_BALANCES,
  BALANCES_RETURNED,
  INVEST,
  INVEST_RETURNED,
  REDEEM,
  REDEEM_RETURNED,
  REBALANCE,
  REBALANCE_RETURNED,
  DONATE,
  DONATE_RETURNED,
  GET_YIELD,
  GET_YIELD_RETURNED,
  GET_UNISWAP_YIELD,
  GET_UNISWAP_YIELD_RETURNED,
  GET_AGGREGATED_YIELD,
  GET_AGGREGATED_YIELD_RETURNED,
  GET_UNISWAP_COMPARRISONS,
  GET_CONTRACT_EVENTS,
  GET_CONTRACT_EVENTS_RETURNED,
  ZAP,
  ZAP_RETURNED,
  IDAI,
  IDAI_RETURNED,
  SWAP,
  SWAP_RETURNED,
  TRADE,
  TRADE_RETURNED,
  GET_CURV_BALANCE,
  GET_CURV_BALANCE_RETURNED,
  BUY_INSURANCE,
  BUY_INSURANCE_RETURNED,
  CLAIM_INSURANCE,
  MINT_INSURANCE,
  MINT_INSURANCE_RETURNED,
  GET_INSURANCE_BALANCES,
  GET_INSURANCE_BALANCES_RETURNED,
  CALCULATE_INSURANCE_COST,
  CALCULATE_INSURANCE_COST_RETURNED,
  GET_ETH_PRICE,
  GET_ETH_PRICE_RETURNED,
  GET_ETH_BALANCE,
  GET_ETH_BALANCE_RETURNED,
  CALCULATE_MAX_TOKENS,
  CALCULATE_MAX_TOKENS_RETURNED,
  GET_BEST_PRICE,
  GET_BEST_PRICE_RETURNED,
  GET_POOL_BALANCES,
  POOL_BALANCES_RETURNED,
  DEPOSIT_POOL,
  DEPOSIT_POOL_RETURNED,
  WITHDRAW_POOL,
  WITHDRAW_POOL_RETURNED,
  EXCHANGE_POOL,
  EXCHANGE_POOL_RETURNED,
  GET_EXCHANGE_PRICE,
  EXCHANGE_PRICE_RETURNED,
  GET_DEPOSIT_PRICE,
  DEPOSIT_PRICE_RETURNED,
  GET_WITHDRAW_PRICE,
  WITHDRAW_PRICE_RETURNED,
  GET_SPOOL_BALANCE,
  SPOOL_BALANCE_RETURNED,
  GET_SPOOL_RATIO,
  GET_SPOOL_RATIO_RETURNED,
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";

const rp = require('request-promise');
const ethers = require('ethers');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();


class Store {
  constructor() {

    this.store = {
      universalGasPrice: '70',
      balancerPools: [
        {
          id: 'ycUSDC/ycUSDT',
          name: 'ycUSDC/ycUSDT',
          description: 'ycUSDC/ycUSDT Pool',
          address: '0xEEeEe1033F5486ccd95c77257b2a2F2EE5f1eed8',
          assets: [
            'ycUSDC',
            'ycUSDT'
          ]
        }
      ],
      balancerAssets: [
        {
          id: 'ycUSDC',
          name: 'ycUSDC',
          description: 'Compound USD Coin',
          symbol: 'cUSDC',
          investSymbol: 'ycUSDC',
          erc20address: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
          investAddress: '0x0597eaf957d896A5751AA35324Bf24E1d9Bc0F2C',
          balancerAddress: '0xEEeEe1033F5486ccd95c77257b2a2F2EE5f1eed8',
          decimals: 8,
          balance: 0,
          investedBalance: 0
        },
        {
          id: 'ycUSDT',
          name: 'ycUSDT',
          description: 'Compound USDT',
          symbol: 'cUSDT',
          investSymbol: 'ycUSDT',
          erc20address: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9',
          investAddress: '0x631d66F79191C86D7b7a7c0E2AfAE3ae943931a4',
          balancerAddress: '0xEEeEe1033F5486ccd95c77257b2a2F2EE5f1eed8',
          decimals: 8,
          balance: 0,
          investedBalance: 0
        }
      ],
      ethPrice: 0,
      aprs: [{
          token: 'DAI',
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          earnAddress: '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01',
          lastMeasurement: 9465912,
          measurement: 1000037230456849197,
          mod: 1,
          decimals: 18
        },/*{
          token: 'CRV',
          address: '0x9Ce551A9D2B1A4Ec0cc6eB0E0CC12977F6ED306C',
          earnAddress: '0x9Ce551A9D2B1A4Ec0cc6eB0E0CC12977F6ED306C',
          lastMeasurement: 9414437,
          measurement: 1008192205495361668,
          mod: 1,
          decimals: 18
        },*/{
          token: 'TUSD',
          address: '0x0000000000085d4780B73119b644AE5ecd22b376',
          earnAddress: '0x73a052500105205d34daf004eab301916da8190f',
          lastMeasurement: 9479531,
          measurement: 1000197346651007837 ,
          created: 0,
          mod: 1,
          decimals: 18
        },{
          token: 'USDC',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          earnAddress: '0xa2609B2b43AC0F5EbE27deB944d2a399C201E3dA',
          lastMeasurement: 9400732,
          measurement: 1001761741440856097,
          mod: 1,
          decimals: 6
        },{
          token: 'USDT',
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          earnAddress: '0x83f798e925BcD4017Eb265844FDDAbb448f1707D',
          lastMeasurement: 9465880,
          measurement: 1000030025124779312,
          mod: 1,
          decimals: 6
        },{
          token: 'SUSD',
          address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
          earnAddress: '0x36324b8168f960A12a8fD01406C9C78143d41380',
          lastMeasurement: 9400732,
          measurement: 1029186724259834543,
          mod: 1,
          decimals: 18
        },/*{
          token: 'LEND',
          address: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03'
        },*/{
          token: 'BAT',
          address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
          created: 0,
          mod: 1,
          earnAddress: '',
          decimals: 18
        },{
          token: 'ETH',
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          created: 0,
          mod: 1,
          earnAddress: '',
          decimals: 18
        },{
          token: 'LINK',
          address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
          created: 0,
          mod: 1,
          earnAddress: '',
          decimals: 18
        },{
          token: 'KNC',
          address: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
          created: 0,
          mod: 1,
          earnAddress: '',
          decimals: 18
        },{
          token: 'REP',
          address: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
          created: 0,
          mod: 1,
          earnAddress: '',
          decimals: 18
        },{
          token: 'MKR',
          address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
          created: 0,
          mod: 1,
          earnAddress: '',
          decimals: 18
        },/*{
          token: 'MANA',
          address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'
        },*/{
          token: 'ZRX',
          address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
          created: 0,
          mod: 1,
          earnAddress: '',
          decimals: 18
        },{
          token: 'SNX',
          address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
          created: 0,
          mod: 1,
          earnAddress: '',
          decimals: 18
        },{
          token: 'wBTC',
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          earnAddress: '0x04EF8121aD039ff41d10029c91EA1694432514e9',
          lastMeasurement: 9427488,
          measurement: 2000175540087812685,
          mod: 1,
          decimals: 18
        },
      ],
      assets: [
        {
          id: 'DAIv3',
          name: 'DAI',
          symbol: 'DAI',
          description: 'DAI Stablecoin',
          investSymbol: 'yDAI',
          erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          iEarnContract: '0xC2cB1040220768554cf699b0d863A3cd4324ce32',
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          decimals: 18,
          price: 0,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 3,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: false
        },
        {
          id: 'USDCv3',
          name: 'USD Coin',
          symbol: 'USDC',
          description: 'USD//C',
          investSymbol: 'yUSDC',
          erc20address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          iEarnContract: '0x26EA744E5B887E5205727f55dFBE8685e3b21951',
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 6,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 3,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: false
        },
        {
          id: 'USDTv3',
          name: 'USDT',
          symbol: 'USDT',
          description: 'Tether USD',
          investSymbol: 'yUSDT',
          erc20address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          iEarnContract: '0xE6354ed5bC4b393a5Aad09f21c46E101e692d447',
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 6,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 3,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: false,
        },
        {
          id: 'BUSDv3',
          name: 'BUSD',
          symbol: 'BUSD',
          description: 'Binance USD',
          investSymbol: 'yBUSD',
          erc20address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
          iEarnContract: '0x04bC0Ab673d88aE9dbC9DA2380cB6B79C4BCa9aE',
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 18,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 3,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: true,
        },
        {
          id: 'DAIv2',
          name: 'DAI',
          symbol: 'DAI',
          description: 'DAI Stablecoin',
          investSymbol: 'yDAI',
          erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          iEarnContract: '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01',
          lastMeasurement: 9465912,
          measurement: 1000037230456849197,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          decimals: 18,
          price: 0,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 2,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: true
        },
        {
          id: 'USDCv2',
          name: 'USD Coin',
          symbol: 'USDC',
          description: 'USD//C',
          investSymbol: 'yUSDC',
          erc20address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          iEarnContract: '0xd6aD7a6750A7593E092a9B218d66C0A814a3436e',
          lastMeasurement: 9465880,
          measurement: 1139534904703193728,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 6,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 2,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: true
        },
        {
          id: 'USDTv2',
          name: 'USDT',
          symbol: 'USDT',
          description: 'Tether USD',
          investSymbol: 'yUSDT',
          erc20address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          iEarnContract: '0x83f798e925BcD4017Eb265844FDDAbb448f1707D',
          lastMeasurement: 9465880,
          measurement: 1000030025124779312,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 6,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 2,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: true,
        },
        {
          id: 'TUSDv2',
          name: 'TUSD',
          symbol: 'TUSD',
          description: 'TrueUSD',
          investSymbol: 'yTUSD',
          erc20address: '0x0000000000085d4780B73119b644AE5ecd22b376',
          iEarnContract: '0x73a052500105205d34Daf004eAb301916DA8190f',
          lastMeasurement: 9479531,
          measurement: 1000197346651007837 ,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 18,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 2,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: true,
        },
        {
          id: 'SUSDv2',
          name: 'SUSD',
          symbol: 'SUSD',
          description: 'Synth sUSD',
          investSymbol: 'ySUSD',
          erc20address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
          iEarnContract: '0xF61718057901F84C4eEC4339EF8f0D86D2B45600',
          lastMeasurement: 9465880,
          measurement: 1000021451644065970,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 18,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 2,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: false,
        },
        {
          id: 'wBTCv2',
          name: 'wBTC',
          symbol: 'wBTC',
          description: 'Wrapped BTC',
          investSymbol: 'yWBTC',
          erc20address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          iEarnContract: '0x04Aa51bbcB46541455cCF1B8bef2ebc5d3787EC9',
          lastMeasurement: 9465880,
          measurement: 999998358212140782,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 8,
          poolValue: 0,
          abi: config.IEarnErc20ABIv2,
          version: 2,
          disabled: false,
          invest: 'deposit',
          redeem: 'withdraw',
          curve: false,
        },
        {
          id: 'DAIv1',
          name: 'DAI',
          symbol: 'DAI',
          description: 'DAI Stablecoin',
          investSymbol: 'yDAI',
          erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          iEarnContract: '0x9D25057e62939D3408406975aD75Ffe834DA4cDd',
          lastMeasurement: 9400732,
          measurement: 1000848185112260412,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          decimals: 18,
          price: 0,
          poolValue: 0,
          abi: config.IEarnERC20ABI,
          version: 1,
          disabled: true,
          invest: 'invest',
          redeem: 'redeem',
          curve: false,
        },
        {
          id: 'USDCv1',
          name: 'USD Coin',
          symbol: 'USDC',
          description: 'USD//C',
          investSymbol: 'yUSDC',
          erc20address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          iEarnContract: '0xa2609B2b43AC0F5EbE27deB944d2a399C201E3dA',
          lastMeasurement: 9400732,
          measurement: 1001761741440856097,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 6,
          poolValue: 0,
          abi: config.IEarnERC20ABI,
          version: 1,
          disabled: true,
          invest: 'invest',
          redeem: 'redeem',
          curve: false,
        },
        {
          id: 'USDTv1',
          name: 'USDT',
          symbol: 'USDT',
          description: 'Tether USD',
          investSymbol: 'yUSDT',
          erc20address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          iEarnContract: '0xa1787206d5b1bE0f432C4c4f96Dc4D1257A1Dd14',
          lastMeasurement: 9400732,
          measurement: 1085531657202472310,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 6,
          poolValue: 0,
          abi: config.IEarnERC20ABI,
          version: 1,
          disabled: true,
          invest: 'invest',
          redeem: 'redeem',
          curve: false,
        },
        {
          id: 'SUSDv1',
          name: 'SUSD',
          symbol: 'SUSD',
          description: 'Synth sUSD',
          investSymbol: 'ySUSD',
          erc20address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
          iEarnContract: '0x36324b8168f960A12a8fD01406C9C78143d41380',
          lastMeasurement: 9400732,
          measurement: 1029186724259834543,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 18,
          poolValue: 0,
          abi: config.IEarnERC20ABI,
          version: 1,
          disabled: true,
          invest: 'invest',
          redeem: 'redeem',
          curve: false,
        },
        {
          id: 'wBTCv1',
          name: 'wBTC',
          symbol: 'wBTC',
          tokenSymbol: 'wBTC',
          description: 'Wrapped BTC',
          investSymbol: 'yBTC',
          erc20address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          iEarnContract: '0x04EF8121aD039ff41d10029c91EA1694432514e9',
          lastMeasurement: 9427488,
          measurement: 2000175540087812685,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 8,
          poolValue: 0,
          abi: config.IEarnERC20ABI,
          version: 1,
          disabled: true,
          invest: 'invest',
          redeem: 'redeem',
          curve: false,
        },
        {
          id: 'CRVv1',
          name: 'cDAI/cUSDC',
          symbol: 'CRV',
          tokenSymbol: 'DAI',
          description: 'Curve.fi cDAI/cUSDC',
          investSymbol: 'yCRV',
          erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          iEarnContract: '0x9Ce551A9D2B1A4Ec0cc6eB0E0CC12977F6ED306C',
          lastMeasurement: 9414437,
          measurement: 1008192205495361668,
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 18,
          poolValue: 0,
          abi: config.IEarnERC20ABI,
          version: 1,
          disabled: true,
          invest: 'invest',
          redeem: 'redeem',
          curve: false,
        },
        {
          id: 'ETHv1',
          name: 'ETH',
          symbol: 'ETH',
          description: 'Ethereum',
          investSymbol: 'iETH',
          erc20address: 'Ethereum',
          iEarnContract: '0x9Dde7cdd09dbed542fC422d18d89A589fA9fD4C0',
          apr: 0,
          maxApr: 0,
          balance: 0,
          decimals: 18,
          investedBalance: 0,
          price: 0,
          poolValue: 0,
          abi: config.IEarnABI,
          version: 1,
          disabled: true,
          invest: 'invest',
          redeem: 'redeem',
          curve: true,
        },
        {
          id: 'iDAIv1',
          name: 'Fulcrum DAI iToken',
          symbol: 'iDAI',
          description: 'Fulcrum DAI iToken',
          erc20address: '0x493c57c4763932315a328269e1adad09653b9081',
          iEarnContract: null,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 18,
          poolValue: 0,
          version: 2,
          disabled: true,
          idai: true
        },
      ],
      account: {},
      web3: null,
      pricePerFullShare: 0,
      yields: [],
      aggregatedYields: [],
      aggregatedHeaders: [],
      uniswapYields: [],
      uniswapLiquidity: [],
      events: [],
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum
      },
      builtWith: [
        {
          website: 'https://DeFiZap.com',
          logo: 'defizap.png',
          name: 'DeFi Zap'
        },
        {
          website: 'https://1inch.exchange',
          logo: 'oneinch.svg',
          name: '1inch'
        },
        {
          website: 'https://www.defisnap.io',
          logo: 'defisnap.svg',
          name: 'DefiSnap'
        },
        {
          website: 'https://www.defipulse.com',
          logo: 'defipulse.png',
          name: 'DeFi Pulse'
        },
        {
          website: 'https://www.curve.fi',
          logo: 'curvefi.jpg',
          name: 'Curve'
        },
        {
          website: 'https://bzx.network',
          logo: 'bzx.png',
          name: 'bZx'
        },
        {
          website: 'http://aave.com',
          logo: 'aave.png',
          name: 'Aave'
        },
        {
          website: 'https://compound.finance',
          logo: 'compound.png',
          name: 'Compound'
        },
        {
          website: 'http://dydx.exchange',
          logo: 'dydx.jpg',
          name: 'dYdX'
        },
        {
          website: 'https://ddex.io',
          logo: 'ddex.jpg',
          name: 'HydroProtocol'
        },
        {
          website: 'https://lendf.me',
          logo: 'lendf.png',
          name: 'LendfMe'
        },
        {
          website: 'https://uniswap.io',
          logo: 'uniswap.png',
          name: 'Uniswap'
        },
        {
          website: 'http://kyber.network',
          logo: 'kybernetwork.png',
          name: 'KyberNetwork'
        },
        {
          website: 'https://synthetix.io',
          logo: 'synthetix.png',
          name: 'Synthetix'
        },
        {
          website: 'https://www.ethereum.org',
          logo: 'ethereum.png',
          name: 'ethereum'
        },
        {
          website: 'https://trufflesuite.com',
          logo: 'truffle.png',
          name: 'Truffle Suite'
        },
        {
          website: 'https://etherscan.io',
          logo: 'etherscan.png',
          name: 'Etherscan'
        },
      ],
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
      curvBalance: 0,
      curveContracts: [
        {
          id: 'crvV1',
          symbol: 'compound.curve.fi',
          version: 1,
          erc20address: '0x3740fb63ab7a09891d7c0d4299442a551d06f5fd',
          decimals: 18,
          balance: 0
        },
        {
          id: 'crvV2',
          symbol: 'usdt.curve.fi',
          version: 2,
          erc20address: '0x9fc689ccada600b6df723d9e47d84d76664a1f23',
          decimals: 18,
          balance: 0
        },
        {
          id: 'crvV3',
          symbol: 'y.curve.fi',
          version: 3,
          erc20address: '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
          decimals: 18,
          balance: 0
        },
        {
          id: 'crvV4',
          symbol: 'busd.curve.fi',
          version: 4,
          erc20address: '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B',
          decimals: 18,
          balance: 0
        }
      ],
      insuranceAssets: [
        {
          id: 'oCurve.fi',
          symbol: '$Curve.fi',
          insuredSymbol: 'oCRV',
          name: 'oCurve.fi',
          description: 'yDAI/yUSDC/yUSDT/yTUSD',
          erc20address: '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
          insuranceAddress: '0x4BA8C6Ce0e855C051e65DfC37883360efAf7c82B',
          insuranceABI:  config.insuranceABI,
          uniswapInsuranceAddress: '0x21f5e9d4ec20571402a5396084b1634314a68c97',
          uniswapInsuranceABI: config.uniswapInsuranceABI,
          decimals: 18,
          insuredDecimals: 15,
          balance: 0,
          insuredBalance: 0,
          apr: 0,
          insuredApr: 0,
          pricePerInsurance: 0,
          tokenPrice: 0
        }
      ],
      ethBalance: 0,
      poolAssets: [
        // {
        //   id: 'DAI',
        //   name: 'DAI',
        //   symbol: 'DAI',
        //   description: 'DAI Stablecoin',
        //   poolSymbol: 'yDAI',
        //   erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        //   vaultContractAddress: null,
        //   vaultContractABI: config.vaultContractABI,
        //   balance: 0,
        //   pooledBalance: 0,
        //   decimals: 18,
        // },
        {
          id: 'USDC',
          name: 'USD Coin',
          symbol: 'USDC',
          description: 'USD//C',
          poolSymbol: 'yUSDC',
          erc20address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          vaultContractAddress: '0x8f40B15dDfD3d32A7Ab7B13b06d828d56A28d6cE',
          vaultContractABI: config.vaultContractABI,
          balance: 0,
          pooledBalance: 0,
          decimals: 6,
        },
        // {
        //   id: 'USDT',
        //   name: 'USDT',
        //   symbol: 'USDT',
        //   description: 'Tether USD',
        //   poolSymbol: 'yUSDT',
        //   erc20address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        //   vaultContractAddress: null,
        //   vaultContractABI: config.vaultContractABI,
        //   balance: 0,
        //   pooledBalance: 0,
        //   decimals: 6,
        // },
        // {
        //   id: 'TUSD',
        //   name: 'TUSD',
        //   symbol: 'TUSD',
        //   description: 'TrueUSD',
        //   poolSymbol: 'yTUSD',
        //   erc20address: '0x0000000000085d4780B73119b644AE5ecd22b376',
        //   vaultContractAddress: null,
        //   vaultContractABI: config.vaultContractABI,
        //   balance: 0,
        //   pooledBalance: 0,
        //   decimals: 18,
        // },
        // {
        //   id: 'LINK',
        //   name: 'ChainLink',
        //   symbol: 'LINK',
        //   description: 'ChainLink',
        //   poolSymbol: 'yLINK',
        //   erc20address: '0x514910771af9ca656af840dff83e8264ecf986ca',
        //   vaultContractAddress: null,
        //   vaultContractABI: config.vaultContractABI,
        //   balance: 0,
        //   pooledBalance: 0,
        //   decimals: 18,
        // },
        // {
        //   id: 'SNX',
        //   name: 'SNX',
        //   symbol: 'SNX',
        //   description: 'Synthetix Network Token',
        //   poolSymbol: 'ySNX',
        //   erc20address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
        //   vaultContractAddress: null,
        //   vaultContractABI: config.vaultContractABI,
        //   balance: 0,
        //   pooledBalance: 0,
        //   decimals: 18,
        // },
        // {
        //   id: 'LEND',
        //   name: 'LEND',
        //   symbol: 'LEND',
        //   description: 'AAVE (LEND)',
        //   poolSymbol: 'yLEND',
        //   erc20address: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
        //   vaultContractAddress: null,
        //   vaultContractABI: config.vaultContractABI,
        //   balance: 0,
        //   pooledBalance: 0,
        //   decimals: 18,
        // },
      ],
      sCrvBalance:  0
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONNECT_LEDGER:
            this.connectLedger(payload);
            break;
          case CONNECT_METAMASK:
            this.connectMetamask(payload);
            break;
          case CONNECT_METAMASK_PASSIVE:
            this.connectMetamaskPassive(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case INVEST:
            this.invest(payload)
            break;
          case REDEEM:
            this.redeem(payload)
            break;
          case REBALANCE:
            this.rebalance(payload)
            break;
          case DONATE:
            this.donate(payload)
            break;
          case GET_YIELD:
            this.getYield(payload);
            break;
          case GET_UNISWAP_YIELD:
            this.getUniswapYield(payload)
            break;
          case GET_AGGREGATED_YIELD:
            this.getAPR(payload)
            break;
          case GET_UNISWAP_COMPARRISONS:
            this.getUniswapComparrisons(payload)
            break;
          case GET_CONTRACT_EVENTS:
            this.getContractEvents(payload)
            break;
          case ZAP:
            this.zap(payload)
            break;
          case IDAI:
            this.idai(payload)
            break;
          case SWAP:
            this.swap(payload)
            break;
          case TRADE:
            this.trade(payload)
            break;
          case GET_CURV_BALANCE:
            this.getCurveBalances(payload)
            break;
          case BUY_INSURANCE:
            this.buyInsurance(payload)
            break;
          case CLAIM_INSURANCE:
            this.claimInsurance(payload)
            break;
          case MINT_INSURANCE:
            this.mintInsurance(payload)
            break;
          case GET_INSURANCE_BALANCES:
            this.getInsuranceBalances(payload)
            break;
          case CALCULATE_INSURANCE_COST:
            this.calculateInsuranceCost(payload)
            break;
          case CALCULATE_MAX_TOKENS:
            this.calculateMaxTokens(payload)
            break;
          case GET_ETH_PRICE:
            this.getEthPrice(payload)
            break;
          case GET_ETH_BALANCE:
            this.getEthBalance(payload)
            break;
          case GET_BEST_PRICE:
            this.getBestPrice(payload)
            break;
          case GET_POOL_BALANCES:
            this.getPoolBalances(payload);
            break;
          case DEPOSIT_POOL:
            this.depositPool(payload)
            break;
          case WITHDRAW_POOL:
            this.withdrawPool(payload)
            break;
          case EXCHANGE_POOL:
            this.exchangePool(payload)
            break;
          case GET_EXCHANGE_PRICE:
            this.getExchangePrice(payload)
            break;
          case GET_DEPOSIT_PRICE:
            this.getDepositPrice(payload)
            break;
          case GET_WITHDRAW_PRICE:
            this.getWithdrawPrice(payload)
            break;
          case GET_SPOOL_BALANCE:
            this.getSPoolBalance(payload)
            break;
          case GET_SPOOL_RATIO:
            this.getSPoolRatio(payload)
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  invest = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    if(asset.erc20address !== 'Ethereum') {
      this._checkApproval(asset, account, amount, asset.iEarnContract, (err) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        this._callInvest(asset, account, amount, (err, investResult) => {
          if(err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(INVEST_RETURNED, investResult)
        })
      })
    } else {
      this._callInvest(asset, account, amount, (err, investResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(INVEST_RETURNED, investResult)
      })
    }
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    try {
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      console.log(ethAllowance)
      console.log(amount)

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        /*
          code to accomodate for "assert _value == 0 or self.allowances[msg.sender][_spender] == 0" in contract
          We check to see if the allowance is > 0. If > 0 set to 0 before we set it to the correct amount.
        */
        if(['crvV1', 'crvV2', 'crvV3', 'crvV4', 'USDTv1', 'USDTv2', 'USDTv3', 'USDT', 'sCRV'].includes(asset.id) && ethAllowance > 0) {
          await erc20Contract.methods.approve(contract, web3.utils.toWei('0', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        }

        await erc20Contract.methods.approve(contract, web3.utils.toWei('999999999999', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _checkApprovalWaitForConfirmation = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")

    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      if(['crvV1', 'crvV2', 'crvV3', 'crvV4', 'USDTv1', 'USDTv2', 'USDTv3', 'sCRV'].includes(asset.id) && ethAllowance > 0) {
        erc20Contract.methods.approve(contract, web3.utils.toWei('0', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', async function(hash){
            erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
              .on('transactionHash', function(hash){
                callback()
              })
              .on('error', function(error) {
                if (!error.toString().includes("-32601")) {
                  if(error.message) {
                    return callback(error.message)
                  }
                  callback(error)
                }
              })
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } else {
      callback()
    }
  }

  _callInvest = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let iEarnContract = new web3.eth.Contract(asset.abi, asset.iEarnContract)
    if(asset.erc20address === 'Ethereum') {
      iEarnContract.methods[asset.invest]().send({ from: account.address, value: web3.utils.toWei(amount, "ether"), gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        .on('transactionHash', function(hash){
          console.log(hash)
          callback(null, hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
          console.log(confirmationNumber, receipt);
        })
        .on('receipt', function(receipt){
          console.log(receipt);
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
        .catch((error) => {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    } else {
      var amountToSend = web3.utils.toWei(amount, "ether")
      if (asset.decimals !== 18) {
        amountToSend = amount*10**asset.decimals;
      }
      iEarnContract.methods[asset.invest](amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        .on('transactionHash', function(hash){
          console.log(hash)
          callback(null, hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
          console.log(confirmationNumber, receipt);
        })
        .on('receipt', function(receipt){
          console.log(receipt);
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
        .catch((error) => {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    }
  }

  rebalance = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callRebalance(asset, account, (err, result) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(REBALANCE_RETURNED, result)
    })
  }

  _callRebalance = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let iEarnContract = new web3.eth.Contract(config.IEarnERC20ABI, asset.iEarnContract)

    iEarnContract.methods.rebalance().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      console.log(hash)
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log(confirmationNumber, receipt);
    })
    .on('receipt', function(receipt){
      console.log(receipt);
    })
    .on('error', function(error) {
      console.log(error);
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  donate = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callDonate(asset, account, amount, (err, result) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(DONATE_RETURNED, result)
    })
  }

  _callDonate = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let iEarnContract = new web3.eth.Contract(config.IEarnERC20ABI, asset.erc20address)

    var amountSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountSend = amount*10**asset.decimals;
    }

    iEarnContract.methods.transfer(asset.iEarnContract, amountSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      console.log(hash)
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log(confirmationNumber, receipt);
    })
    .on('receipt', function(receipt){
      console.log(receipt);
    })
    .on('error', function(error) {
      console.log(error);
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  redeem = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callRedeem(asset, account, amount, (err, redeemResult) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }
      return emitter.emit(REDEEM_RETURNED, redeemResult)
    })
  }

  _callRedeem = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let iEarnContract = new web3.eth.Contract(asset.abi, asset.iEarnContract)

    var amountSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountSend = amount*10**asset.decimals;
    }

    iEarnContract.methods[asset.redeem](amountSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      console.log(hash)
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log(confirmationNumber, receipt);
    })
    .on('receipt', function(receipt){
      console.log(receipt);
    })
    .on('error', function(error) {
      console.log(error);
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  getBalances = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('assets')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getInvestedBalance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getPoolPrice(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getMaxAPR(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getPoolValue(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getAPY(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getCurrentLender(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getRecommendedLender(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getBalance(web3, asset, account, callbackInner) },
      ], (err, data) => {
        asset.balance = data[0]
        asset.investedBalance = data[1]
        asset.price = data[2]
        asset.maxApr = data[3]
        asset.poolValue = data[4]
        asset.apy = data[5]
        asset.current = data[6]
        asset.recommended = data[7]
        asset.tokenBalance = data[8]

        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ assets: assets })
      return emitter.emit(BALANCES_RETURNED, assets)
    })
  }

  _getInsuredBalance = async (web3, asset, account, callback) => {

    if(asset.insuranceAddress === null) {
      return callback(null, 0)
    }

    let erc20Contract = new web3.eth.Contract(config.insuranceABI, asset.insuranceAddress)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.insuredDecimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  _getERC20Balance = async (web3, asset, account, callback) => {

    if(asset.erc20address === 'Ethereum') {
      try {
        const eth_balance = web3.utils.fromWei(await web3.eth.getBalance(account.address), "ether");
        callback(null, parseFloat(eth_balance))
      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
    } else {
      let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)

      try {
        var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
        balance = parseFloat(balance)/10**asset.decimals
        callback(null, parseFloat(balance))
      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
    }
  }

  _getBalance = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, 0)
    }

    if(asset.erc20address === 'Ethereum') {
      try {
        const eth_balance = web3.utils.fromWei(await web3.eth.getBalance(asset.iEarnContract), "ether");
        callback(null, parseFloat(eth_balance))
      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
    } else {
      let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)

      try {
        var balance = await erc20Contract.methods.balanceOf(asset.iEarnContract).call({ from: account.address });
        balance = parseFloat(balance)/10**asset.decimals
        callback(null, parseFloat(balance))
      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
    }
  }

  _getAPY = async (web3, asset, account, callback) => {
    if(asset.iEarnContract === null) {
      return callback(null, 0)
    }
    if (asset.measurement == null) {
      return callback(null, 0)
    }
    try {
      let block = await web3.eth.getBlockNumber();
      let earn = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract);
      let balance = await earn.methods.getPricePerFullShare().call();

      balance = balance - asset.measurement;
      balance = balance / 1e18;
      let diff = block - asset.lastMeasurement;

      balance = balance / diff;
      balance = balance * 2425846;

      callback(null, parseFloat(balance))
    } catch (e) {
      console.log(e)
      callback(null, 0)
    }
  }

  _getCurrentLender = async (web3, asset, account, callback) => {
    if(asset.iEarnContract === null) {
      return callback(null, 0)
    }

    try {
      let iEarnContract = new web3.eth.Contract(asset.abi, asset.iEarnContract)
      let value = 0

      if(asset.erc20address === 'Ethereum' || asset.id === 'CRVv1') {
        value = 0;
      } else {
        value = await iEarnContract.methods.provider().call({ from: account.address });
      }
      callback(null, parseFloat(value))
    } catch (e) {
      console.log(e)
      callback(null, 0)
    }
  }

  _getRecommendedLender = async (web3, asset, account, callback) => {
    if(asset.iEarnContract === null) {
      return callback(null, 0)
    }

    try {
      let iEarnContract = new web3.eth.Contract(asset.abi, asset.iEarnContract)
      let value = 0

      if(asset.erc20address === 'Ethereum' || asset.id === 'CRVv1') {
        value = 0;
      } else {
        value = await iEarnContract.methods.recommend().call({ from: account.address });
      }
      callback(null, parseFloat(value))
    } catch (e) {
      console.log(asset)
      console.log(e)
      callback(null, 0)
    }
  }

  _getPoolValue = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, 0)
    }

    try {
      let iEarnContract = new web3.eth.Contract(asset.abi, asset.iEarnContract)
      let value = 0

      if(asset.erc20address === 'Ethereum') {
        value = web3.utils.fromWei(await iEarnContract.methods.calcPoolValueInETH().call({ from: account.address }), 'ether');
      } else {
        value = await iEarnContract.methods.calcPoolValueInToken().call({ from: account.address });
        if (asset.decimals === 18) {
          value = web3.utils.fromWei(value, 'ether');
        } else {
          value = value / (10 ** asset.decimals);
        }
      }
      callback(null, parseFloat(value))
    } catch (e) {
      console.log(e)
      callback(null, 0)
    }

  }

  _getPoolPrice = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, 0)
    }

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)
    const balance = web3.utils.fromWei(await iEarnContract.methods.getPricePerFullShare().call({ from: account.address }), 'ether');
    callback(null, parseFloat(balance))
  }

  _getInvestedBalance = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, 0)
    }

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)
    var  balance = await iEarnContract.methods.balanceOf(account.address).call({ from: account.address });
    balance = parseFloat(balance)/10**asset.decimals
    callback(null, parseFloat(balance))
  }

  _getMaxAPR = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, 0)
    }
    if (asset.symbol === 'CRV') {
      let aprContract = new web3.eth.Contract(config.crvContractABI, config.crvAddress)
      const call = 'crvapr'
      const aprs = await aprContract.methods[call]().call();
      return callback(null, web3.utils.fromWei(parseFloat(aprs).toFixed(0), 'ether'))
    }

    let aprContract = new web3.eth.Contract(config.aggregatedContractABI, config.aggregatedContractAddress)

    var call = 'getAPROptions';//+asset.symbol
    var address = asset.erc20address
    var aprs = 0;
    if (asset.erc20address === 'Ethereum') {
      call = 'getETH';
      aprs = await aprContract.methods[call]().call();
    } else {
      aprs = await aprContract.methods[call](address).call();
    }


    const keys = Object.keys(aprs)
    const workKeys = keys.filter((key) => {
      return isNaN(key)
    })
    const maxApr = Math.max.apply(Math, workKeys.map(function(o) {
      if(o === 'uniapr' || o === 'unicapr' || o === "iapr") {
        return aprs[o]-100000000000000000000
      }
      return aprs[o];
    }))

    callback(null, web3.utils.fromWei(maxApr.toFixed(0), 'ether'))
  }

  getYield = (payload) => {

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const getCalls = config.APROracleABI.filter((call) => {
      if(!call.name || ['getPrice', 'getLiquidity', 'getAaveCore'].includes(call.name)) {
        return false
      }
      return call.name.includes("get") && !call.name.includes("All")
    }).filter((call) => {
      return call.inputs.length === 0
    })

    async.map(getCalls, (calls, callback) => {
      this._getYield(web3, calls, callback)
    }, (err, yields) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ yields: yields })
      return emitter.emit(GET_YIELD_RETURNED, yields)
    })
  }

  _getYield = async (web3, call, callback) => {
    let aprContract = new web3.eth.Contract(config.APROracleABI, config.APROracleAddress)

    try {
      const val = await aprContract.methods[call.name]().call()

      const name = call.name.replace('get', '').replace('APR', '')

      const apr = web3.utils.fromWei(val.toString(), 'ether');

      call.token = name
      call.apr = (apr*100).toFixed(4)

      callback(null, call)
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  getUniswapComparrisons = (payload) => {
    this.getYield(payload)
    this.getUniswapLiquidity(payload, () => {
      this.getUniswapYield(payload)
    })
  }

  getUniswapLiquidity = (payload, cb) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const limit = 50;

    const getCalls = config.uniswapLiquidityABI.filter((call) => {
      if(!call.name || call.inputs.length > 0) {
        return false
      }
      return call.name.includes("get")
    })

    async.map(getCalls, (calls, callback) => {
      this._getUniswapLiquidity(web3, calls, callback)
    }, (err, liquidity) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      const liq = liquidity.filter((call) => {
        //remove < 50 liquidity
        return call.liquidity >= limit
      })

      store.setStore({ uniswapLiquidity: liq })

      cb()
    })
  }

  _getUniswapLiquidity = async (web3, call, callback) => {
    let uniswapContract = new web3.eth.Contract(config.uniswapLiquidityABI, config.uniswapLiquidityAddress)

    const name = call.name.replace('get', '').replace('UniROI', '')

    try {
      let val = await uniswapContract.methods[call.name]().call()

      call.token = name
      call.liquidity = web3.utils.fromWei(val['1'].toString(), 'ether');
      call.something = val['0'];

      callback(null, call)
    } catch(ex) {
      //We are going to ignore these for now. They are returning an Error: Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.
      // console.log(call.name)
      // console.log(ex)
      // return callback(ex)
      call.token = name
      call.liquidity = 0
      callback(null, call)
    }
  }

  getUniswapYield = (payload) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const getCalls = config.uniswapAPRABI.filter((call) => {
      if(!call.name || call.inputs.length > 0) {
        return false
      }
      return call.name.includes("calc")
    })

    async.map(getCalls, (calls, callback) => {
      this._getUniswapYield(web3, calls, callback)
    }, (err, yields) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ uniswapYields: yields })
      return emitter.emit(GET_UNISWAP_YIELD_RETURNED, yields)
    })
  }

  _getUniswapYield = async (web3, call, callback) => {
    let uniswapContract = new web3.eth.Contract(config.uniswapAPRABI, config.uniswapAPRAddress)

    try {
      const name = call.name.replace('calcUniswapAPR', '')
      const val = await uniswapContract.methods[call.name]().call()
      const apr = web3.utils.fromWei(val['0'].toString(), 'ether')

      call.token = name
      call.apr = apr

      callback(null, call)
    } catch(ex) {
      //We are going to ignore these for now. They are returning an Error: Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.
      // console.log(call.name)
      // console.log(ex)
      // return callback(ex)
      callback(null, false)
    }
  }

  getAggregatedYield = (payload) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const getCalls = config.aggregatedContractABI.filter((call) => {
      if(!call.name ||  call.name === 'getAPROptions') {
        return false
      }
      return call.name.includes("get")
    })

    async.map(getCalls, (calls, callback) => {
      this._getAggregatedYield(web3, calls, callback)
    }, (err, yields) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      //get all headers
      const headers = Object.keys(yields[0].apr)
      store.setStore({ aggregatedYields: yields, aggregatedHeaders: headers })
      return emitter.emit(GET_AGGREGATED_YIELD_RETURNED, yields)
    })
  }

  getAPR = (payload) => {
    var value = 0;
    if (payload.content&&payload.content.amount) {
      value = payload.content.amount;
    }
    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));

    async.map(store.getStore('aprs'), (apr, callback) => {
      apr.value = value.toString();
      this._getAPR(web3, apr, callback)
    }, (err, yields) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }
      //get all headers
      console.log(yields[0])
      const headers = Object.keys(yields[0].apr)
      store.setStore({ aggregatedYields: yields, aggregatedHeaders: headers })
      return emitter.emit(GET_AGGREGATED_YIELD_RETURNED, yields)
    })
  }

  _getAPR = async (web3, apr, callback) => {
    let contract = new web3.eth.Contract(config.aprContractABI, config.aprContractAddress)
    var value = apr.value;
    if (apr.decimals === 6) {
      value = web3.utils.toWei(apr.value, 'picoether');
    } else {
      value = web3.utils.toWei(apr.value, 'ether');
    }
    try {
      const val = await contract.methods['getAPROptionsAdjusted'](apr.address, value).call()
      const keys = Object.keys(val)

      const vals = keys.filter((key) => {
        return isNaN(key)
      }).map((key) => {
        const obj = {}
        obj[key] = web3.utils.fromWei(val[key].toString(), 'ether');
        return obj
      })

      let output = {}

      for(let i = 0; i < vals.length; i++) {
        const keys = Object.keys(vals[i])
        if (keys[0] === '_unifulcrum'||keys[0] === '_uniaave'||keys[0] === '_unicompound'||keys[0] === '_uniswap') {
          // skip
        } else {
          output[keys[0]] = vals[i][keys[0]]
        }
      }

      let iearn = 0;
      if (apr.earnAddress !== '') {
        let block = await web3.eth.getBlockNumber();
        let earn = new web3.eth.Contract(config.IEarnABI, apr.earnAddress);
        let balance = await earn.methods.getPricePerFullShare().call();

        balance = balance - apr.measurement;
        balance = balance / 1e18;
        let diff = block - apr.lastMeasurement;

        balance = balance / diff;
        balance = balance * 2425846;
        iearn = balance;
      }
      output["iearn.finance \n(APY)"] = iearn;
      apr.apr = output

      callback(null, apr)
    } catch(ex) {
      console.log(ex);
      // return callback(ex)
      callback(null, false)
    }
  }

  _getAggregatedYield = async (web3, call, callback) => {
    let uniswapContract = new web3.eth.Contract(config.aggregatedContractABI, config.aggregatedContractAddress)

    try {

      const val = await uniswapContract.methods[call.name]().call()

      const keys = Object.keys(val)

      const vals = keys.filter((key) => {
        return isNaN(key)
      }).map((key) => {
        const obj = {}
        obj[key] = web3.utils.fromWei(val[key].toString(), 'ether');
        return obj
      })

      let output = {}

      for(let i = 0; i < vals.length; i++) {
        const keys = Object.keys(vals[i])
        output[keys[0]] = vals[i][keys[0]]
      }

      call.token = call.name.replace('get', '')
      call.apr = output

      callback(null, call)
    } catch(ex) {
      // console.log(ex)
      // return callback(ex)
      callback(null, false)
    }
  }

  getContractEvents = (payload) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let iEarnContract = new web3.eth.Contract(config.IEarnABI, config.iEarnContract)

    iEarnContract.getPastEvents('allEvents', { fromBlock: 1, toBlock: 'latest' })
      .then((res) => {

        const sorted = res.sort((a, b) => {
          return parseFloat(a.blockNumber) - parseFloat(b.blockNumber)
        }).filter((tx) => {
          if(tx.event !== 'Transfer') {
            return false
          }

          if(!tx.returnValues.value || tx.returnValues.value === 0) {
            return false
          }

          if(tx.returnValues.from !== '0x0000000000000000000000000000000000000000') {
            return false
          }

          return true
        }).map(async (tx) => {
          const rawTx = await this._getTransaction(web3, tx.transactionHash)

          return {
            blockNumber: tx.blockNumber,
            transactionHash: tx.transactionHash,
            eth: web3.utils.fromWei(rawTx.value, 'ether'),
            iEth: web3.utils.fromWei(tx.returnValues.value, 'ether'),
            ethRatio: tx.returnValues.value*100/rawTx.value,
            address: rawTx.from
          }
        })

        Promise.all(sorted).then(async (transactions) => {
          const pricePerFullShare = await this._getPricePerFullShare(web3, iEarnContract)

          const trxs = transactions.map(async (tx) => {
            //console.log(tx.address)
            const balance = await this._getIEthBalance(web3, iEarnContract, tx.address)

            tx.ethRedeem = (parseFloat(pricePerFullShare)*parseFloat(balance))
            tx.growth = (parseFloat(tx.ethRedeem)*100/parseFloat(tx.eth))
            return tx
          })

          Promise.all(trxs).then(async (txs) => {
            store.setStore({ events: txs })
            return emitter.emit(GET_CONTRACT_EVENTS_RETURNED, txs)
          })
        })
      })
  }

  _getTransaction = async (web3, hash) => {
    const rawTx = await web3.eth.getTransaction(hash)
    return rawTx
  }

  _getPricePerFullShare = async (web3, iEarnContract) => {
    const balance = web3.utils.fromWei(await iEarnContract.methods.getPricePerFullShare().call({ }), 'ether');
    return balance
  }

  _getIEthBalance = async (web3, iEarnContract, address) => {
    const balance = web3.utils.fromWei(await iEarnContract.methods.balanceOf(address).call({ }), 'ether');
    return balance
  }

  swap = (payload) => {
    const account = store.getStore('account')
    const { sendAsset, amount } = payload.content

    let yCurveZapSwapContract = config.yCurveZapSwapAddress
    if (sendAsset.id === 'crvV3') {
      yCurveZapSwapContract = config.yCurveZapSwapV4Address
    }

    this._checkApproval(sendAsset, account, amount, yCurveZapSwapContract, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callSwap(sendAsset, account, amount, (err, swapResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(SWAP_RETURNED, swapResult)
      })
    })
  }

  _callSwap = async (sendAsset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (sendAsset.decimals !== 18) {
      amountToSend = amount*10**sendAsset.decimals;
    }

    let call = ''

    switch (sendAsset.id) {
      case 'crvV1':
        call = 'swapv1tov3'
        break;
      case 'crvV2':
        call = 'swapv2tov3'
        break;
      case 'crvV3':
        call = 'swapv3tov4'
        break;
      default:
    }

    let yCurveZapSwapContract = new web3.eth.Contract(config.yCurveZapSwapABI, config.yCurveZapSwapAddress)
    if (sendAsset.id === 'crvV3') {
      yCurveZapSwapContract = new web3.eth.Contract(config.yCurveZapSwapV4ABI, config.yCurveZapSwapV4Address)
    }
    yCurveZapSwapContract.methods[call](amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getBestPrice = (payload) => {
    const account = store.getStore('account')
    const { sendAsset, receiveAsset, amount } = payload.content

    this._getBestPrice(sendAsset, receiveAsset, account, amount, (err, price) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(GET_BEST_PRICE_RETURNED, price)
    })
  }

  _getBestPrice = async (sendAsset, receiveAsset, account, amount, callback) => {
    try {
      const url = 'https://api-v2.dex.ag/price?from='+sendAsset.symbol.toLowerCase()+'&to='+receiveAsset.symbol.toLowerCase()+'&fromAmount='+amount+'&dex=ag&tradable=true'
      let price = await rp(url);
      callback(null, JSON.parse(price));
    } catch(e) {
      callback(null, {})
    }
  }

  trade = (payload) => {
    const account = store.getStore('account')
    const { sendAsset, receiveAsset, amount } = payload.content

    this._callTrade(sendAsset, receiveAsset, account, amount, (err, tradeResult) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(TRADE_RETURNED, tradeResult)
    })
  }

  _callTrade = async (sendAsset, receiveAsset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let trade = await this._getDexAgTrade(sendAsset, receiveAsset, account, amount);
    // await this._approveToken(trade.metadata.input.address, trade.metadata.input.spender, trade.metadata.input.amount, account, web3);

    try {
      const tx = await this._sendTrade(trade, account, web3);
      return callback(null, tx.transactionHash)
    } catch(ex) {
      return callback(ex.message)
    }
  }

  _getDexAgTrade = async (sendAsset, receiveAsset, account, amount) => {
    const url = 'https://api-v2.dex.ag/trade?from='+sendAsset.symbol.toLowerCase()+'&to='+receiveAsset.symbol.toLowerCase()+'&fromAmount='+amount+'&dex=best'
    let trade = await rp(url);
    return JSON.parse(trade);
  }

  _approveToken = async (token, spender, amount, account, web3) => {
    // First 4 bytes of the hash of "fee()" for the sighash selector
    let funcHash = ethers.utils.hexDataSlice(ethers.utils.id('approve(address,uint256)'), 0, 4);

    let abi = new ethers.utils.AbiCoder();
    let inputs = [{
      name: 'spender',
      type: 'address'
    }, {
      name: 'amount',
      type: 'uint256'
    }];

    let params = [spender, amount];
    let bytes = abi.encode(inputs, params).substr(2);

    // construct approval data from function hash and parameters
    let inputData = `${funcHash}${bytes}`;

    // let nonce = await infuraProvider.getTransactionCount(ethersWallet.address);
    let nonce = await web3.eth.getTransactionCount(account.address)

    // You will want to get the real gas price from https://ethgasstation.info/json/ethgasAPI.json
    let gasPrice = web3.utils.toWei(await this._getGasPrice(), 'gwei');

    let transaction = {
      to: token,
      nonce: nonce,
      gasLimit: 500000, // You will want to use estimateGas instead for real apps
      gasPrice: gasPrice,
      data: inputData,
      from: account.address
    }

    // let tx = await ethersWallet.sendTransaction(transaction);
    let tx = await web3.eth.sendTransaction(transaction)
    console.log(tx);
  }

  _sendTrade = async (trade, account, web3) => {
    // let nonce = await infuraProvider.getTransactionCount(ethersWallet.address);
    let nonce = await web3.eth.getTransactionCount(account.address)

    // You will want to get the real gas price from https://ethgasstation.info/json/ethgasAPI.json
    let gasPrice = web3.utils.toWei(await this._getGasPrice(), 'gwei');;
    if (trade.metadata.gasPrice) {
        // Use the contract gas price if specified (Bancor)
        gasPrice = trade.metadata.gasPrice
    }

    let transaction = trade.trade;
    transaction.nonce = nonce;
    transaction.gasPrice = Number(gasPrice);
    transaction.gasLimit = 500000; // You will want to use estimateGas instead for real apps
    transaction.value = Number(transaction.value);
    transaction.from = account.address
    // let tx = await ethersWallet.sendTransaction(transaction);
    let tx = await web3.eth.sendTransaction(transaction)
    return tx
  }

  zap = (payload) => {
    const account = store.getStore('account')
    const { sendAsset, receiveAsset, amount } = payload.content

    let contractAddress = ''

    if(receiveAsset.id === 'crvV3') {
      contractAddress = config.yCurveZapAddress
    }
    if(receiveAsset.id === 'crvV4') {
      contractAddress = config.yCurveZapV4Address
    }
    if(sendAsset.id === 'crvV3') {
      contractAddress = config.yCurveZapOutAddress
    }
    if(sendAsset.id === 'crvV4') {
      contractAddress = config.yCurveZapOutV4Address
    }

    this._checkApproval(sendAsset, account, amount, contractAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callZap(sendAsset, receiveAsset, account, amount, (err, zapResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(ZAP_RETURNED, zapResult)
      })
    })
  }

  _callZap = async (sendAsset, receiveAsset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (sendAsset.decimals !== 18) {
      amountToSend = amount*10**sendAsset.decimals;
    }

    let yCurveZapContract = null
    if(receiveAsset.id === 'crvV3') {
      yCurveZapContract = new web3.eth.Contract(config.yCurveZapABI, config.yCurveZapAddress)
    } else if(receiveAsset.id === 'crvV4') {
      yCurveZapContract = new web3.eth.Contract(config.yCurveZapV4ABI, config.yCurveZapV4Address)
    } else if(sendAsset.id === 'crvV3') {
      yCurveZapContract = new web3.eth.Contract(config.yCurveZapOutABI, config.yCurveZapOutAddress)
    } else if(sendAsset.id === 'crvV4') {
      yCurveZapContract = new web3.eth.Contract(config.yCurveZapOutV4ABI, config.yCurveZapOutV4Address)
    }
    let call = ''

    switch (sendAsset.id) {
      case 'DAIv2':
      case 'DAIv3':
        call = 'depositDAI'
        break;
      case 'USDCv2':
      case 'USDCv3':
        call = 'depositUSDC'
        break;
      case 'USDTv2':
      case 'USDTv3':
        call = 'depositUSDT'
        break;
      case 'TUSDv2':
        call = 'depositTUSD'
        break;
      case 'BUSDv3':
        call = 'depositBUSD'
        break;
      case 'crvV3':
      case 'crvV4':
        switch (receiveAsset.id) {
          case 'DAIv2':
          case 'DAIv3':
            call = 'withdrawDAI'
            break;
          case 'USDCv2':
          case 'USDCv3':
            call = 'withdrawUSDC'
            break;
          case 'USDTv2':
          case 'USDTv3':
            call = 'withdrawUSDT'
            break;
          case 'TUSDv2':
            call = 'withdrawTUSD'
            break;
          case 'BUSDv3':
            call = 'withdrawBUSD'
            break;
          default:

        }
        break;
      default:
    }

    yCurveZapContract.methods[call](amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  idai = (payload) => {
    const account = store.getStore('account')
    const { sendAsset, receiveAsset, amount } = payload.content

    this._checkApproval(sendAsset, account, amount, config.iDAIZapSwapAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callIDAI(sendAsset, receiveAsset, account, amount, (err, zapResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(IDAI_RETURNED, zapResult)
      })
    })
  }

  _callIDAI = async (sendAsset, receiveAsset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (sendAsset.decimals !== 18) {
      amountToSend = amount*10**sendAsset.decimals;
    }

    let call = 'swapiDAItoyDAI'

    let iDAIZapSwapContract = new web3.eth.Contract(config.iDAIZapSwapABI, config.iDAIZapSwapAddress)
    iDAIZapSwapContract.methods[call](amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getCurveBalances = (payload) => {
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);
    const curveContracts = store.getStore('curveContracts')

    async.map(curveContracts, (curv, callback) => {

      this._getERC20Balance(web3, curv, account, (err, balance) => {
        if(err) {
          return callback(err)
        }
        curv.balance = balance

        callback(null, curv)
      })
    }, (err, result) => {

      store.setStore({ curveContracts: result })

      return emitter.emit(GET_CURV_BALANCE_RETURNED, result)
    })
  }

  buyInsurance = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callBuyInsurance(asset, account, amount, (err, insureResult) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(BUY_INSURANCE_RETURNED, insureResult)
    })
  }

  _callBuyInsurance = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    // let deadline = await web3.eth.getBlockNumber()
    let deadline = moment().unix()
    deadline = deadline + 1600
    const tokensBought = (amount * 1e15).toFixed(0)

    this._getPricePerInsurance(web3, asset, account, amount, async (err, price) => {
      let uniswapContract = new web3.eth.Contract(asset.uniswapInsuranceABI, asset.uniswapInsuranceAddress)

      const sendEth = await uniswapContract.methods.getEthToTokenOutputPrice(tokensBought).call({ from: account.address })

      uniswapContract.methods.ethToTokenSwapOutput(tokensBought, deadline).send({ from: account.address, value: sendEth, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        .on('transactionHash', function(hash){
          console.log(hash)
          callback(null, hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
          console.log(confirmationNumber, receipt);
        })
        .on('receipt', function(receipt){
          console.log(receipt);
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
        .catch((error) => {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    })

  }

  claimInsurance = (payload) => {

  }

  mintInsurance = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callMintInsurance(asset, account, amount, (err, mintInsuranceResult) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(MINT_INSURANCE_RETURNED, mintInsuranceResult)
    })
  }

  _callMintInsurance = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let insuranceContract = new web3.eth.Contract(asset.insuranceABI, asset.insuranceAddress)

    const ethAmount = web3.utils.toWei(amount, 'ether')

    var maxTokens = await insuranceContract.methods.maxOTokensIssuable(ethAmount).call({ from: account.address });
    //160/200 collateralization ration.
    maxTokens = (maxTokens*4/5).toFixed(0)

    insuranceContract.methods.createETHCollateralOption(maxTokens, account.address).send({ from: account.address, value: ethAmount, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  calculateMaxTokens = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    const web3 = new Web3(store.getStore('web3context').library.provider);

    this._getMaxOTokensIssuable(web3, asset, account, amount, (err, maxTokens) => {
      return emitter.emit(CALCULATE_MAX_TOKENS_RETURNED, maxTokens)
    })
  }

  _getMaxOTokensIssuable = async (web3, asset, account, amount, callback) => {
    let insuranceContract = new web3.eth.Contract(asset.insuranceABI, asset.insuranceAddress)

    var maxTokens = await insuranceContract.methods.maxOTokensIssuable(web3.utils.toWei(amount, 'ether')).call({ from: account.address });

    //160/200 collateralization ration, 16 decimals.
    maxTokens = (maxTokens*4/5)/1e15
    callback(null, maxTokens)
  }

  calculateInsuranceCost = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    const web3 = new Web3(store.getStore('web3context').library.provider);

    this._getPricePerInsurance(web3, asset, account, amount, (err, price) => {
      return emitter.emit(CALCULATE_INSURANCE_COST_RETURNED, price)
    })
  }

  getInsuranceBalances = (payload) => {
    const account = store.getStore('account')
    const assets = store.getStore('insuranceAssets')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getInsuredBalance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getExpiryBlock(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getPricePerInsurance(web3, asset, account, 1000, callbackInner) },
        (callbackInner) => { this._getMaxOTokensIssuable(web3, asset, account, '1000', callbackInner) }
      ], (err, data) => {
        asset.balance = data[0]
        asset.insuredBalance = data[1]
        asset.expiryBlock = data[2]
        asset.pricePerInsurance = data[3]
        asset.tokenPrice = 1000/data[4]

        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ insuranceAssets: assets })
      return emitter.emit(GET_INSURANCE_BALANCES_RETURNED, assets)
    })
  }

  _getPricePerInsurance = async (web3, asset, account, amount, callback) => {
    let uniswapContract = new web3.eth.Contract(asset.uniswapInsuranceABI, asset.uniswapInsuranceAddress)

    var price = await uniswapContract.methods.getEthToTokenOutputPrice((amount * 1e15).toFixed(0)).call({ from: account.address });

    price = (price/1e18)/amount
    callback(null, price)
  }

  _getExpiryBlock = async (web3, asset, account, callback) => {
    if(asset.insuranceAddress === null) {
      return callback(null, 0)
    }

    let erc20Contract = new web3.eth.Contract(config.insuranceABI, asset.insuranceAddress)

    try {
      var expiryBlock = await erc20Contract.methods.expiry().call({ from: account.address });
      callback(null, expiryBlock)
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  getEthPrice = (payload) => {
    this._getEthPrice((err, price) => {
      store.setStore({ ethPrice: price })
      return emitter.emit(GET_ETH_PRICE_RETURNED, price)
    })
  }

  _getEthPrice = (callback) => {
    const requestOptions = {
      method: 'GET',
      uri: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      json: true
    };

    rp(requestOptions).then(response => {
      callback(null, response.ethereum.usd);
    }).catch((err) => {
      callback(err.message);
    });
  }

  getEthBalance = async (payload) => {
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const ethBalance = web3.utils.fromWei(await web3.eth.getBalance(account.address), "ether");
    store.setStore({ ethBalance: parseFloat(ethBalance) })

    return emitter.emit(GET_ETH_BALANCE_RETURNED, parseFloat(ethBalance))
  }

  getPoolBalances = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('poolAssets')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getPooledBalance(web3, asset, account, callbackInner) },
      ], (err, data) => {
        asset.balance = data[0]
        asset.pooledBalance = data[1]

        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ poolAssets: assets })
      return emitter.emit(POOL_BALANCES_RETURNED, assets)
    })
  }

  _getPooledBalance = async (web3, asset, account, callback) => {
    if(asset.vaultContractAddress === null) {
      return callback(null, 0)
    }

    let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)
    var  balance = await vaultContract.methods.balanceOf(account.address).call({ from: account.address });
    balance = parseFloat(balance)/10**asset.decimals
    callback(null, parseFloat(balance))
  }

  depositPool = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._checkApproval(asset, account, amount, asset.vaultContractAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callDepositPool(asset, account, amount, (err, depositResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(DEPOSIT_POOL_RETURNED, depositResult)
      })
    })
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
    console.log(ethAllowance)
    console.log(amount)
    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    try {
      if(['crvV1', 'crvV2', 'crvV3', 'crvV4', 'USDTv1', 'USDTv2', 'USDTv3', 'USDT'].includes(asset.id)) {
        const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })
        const ethAllowance = web3.utils.fromWei(allowance, "ether")
        if(ethAllowance > 0) {
          erc20Contract.methods.approve(contract, web3.utils.toWei('0', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
            .on('transactionHash', function(hash){
              //success...
            })
            .on('error', function(error) {
              if (!error.toString().includes("-32601")) {
                if(error.message) {
                  return callback(error.message)
                }
                callback(error)
              }
            })
        }
      }

      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _callDepositPool = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountToSend = amount*10**asset.decimals;
    }

    vaultContract.methods.deposit(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  withdrawPool = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callWithdrawPool(asset, account, amount, (err, withdrawResult) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }
      return emitter.emit(WITHDRAW_POOL_RETURNED, withdrawResult)
    })
  }

  _callWithdrawPool = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)

    var amountSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountSend = amount*10**asset.decimals;
    }

    vaultContract.methods.withdraw(amountSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      console.log(hash)
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log(confirmationNumber, receipt);
    })
    .on('receipt', function(receipt){
      console.log(receipt);
    })
    .on('error', function(error) {
      console.log(error);
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  getExchangePrice = async (payload) => {
    const account = store.getStore('account')
    const { sendAsset, receiveAsset, sendAmount } = payload.content
    const poolAssets = store.getStore('poolAssets')

    const web3 = new Web3(store.getStore('web3context').library.provider);
    const exchangeContract = new web3.eth.Contract(config.exchangeContractABI, config.exchangeContractAddress)

    const assetToSend = poolAssets.filter((asset) => { return asset.id === sendAsset})[0]
    const assetToReceive = poolAssets.filter((asset) => { return asset.id === receiveAsset})[0]

    const sendIndex = assetToSend.index
    const receiveIndex = assetToReceive.index

    let amount = 0
    if(assetToSend.decimals === 18) {
      amount = web3.utils.toWei(sendAmount, "ether")
    } else {
      amount = sendAmount*10**assetToSend.decimals
    }
    let price = await exchangeContract.methods.get_dy_underlying(sendIndex, receiveIndex, amount).call({ from: account.address })

    if(assetToReceive.decimals === 18) {
      price = web3.utils.fromWei(price, "ether")
    } else {
      price = price/(10**assetToReceive.decimals)
    }

    return emitter.emit(EXCHANGE_PRICE_RETURNED, price)
  }

  exchangePool = (payload) => {
    const account = store.getStore('account')
    const { sendAsset, receiveAsset, sendAmount } = payload.content
    const poolAssets = store.getStore('poolAssets')

    const asset = poolAssets.filter((asset) => { return asset.id === sendAsset})[0]

    this._checkApproval(asset, account, sendAmount, config.exchangeContractAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callExchangePool(sendAsset, receiveAsset, sendAmount, account, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(EXCHANGE_POOL_RETURNED, res)
      })
    })
  }

  _callExchangePool = async (sendAsset, receiveAsset, sendAmount, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const poolAssets = store.getStore('poolAssets')

    console.log(config.exchangeContractABI)
    console.log(config.exchangeContractAddress)

    const exchangeContract = new web3.eth.Contract(config.exchangeContractABI, config.exchangeContractAddress)

    const assetToSend = poolAssets.filter((asset) => { return asset.id === sendAsset})[0]
    const assetToReceive = poolAssets.filter((asset) => { return asset.id === receiveAsset})[0]

    const sendIndex = assetToSend.index
    const receiveIndex = assetToReceive.index

    let amount = 0
    if(assetToSend.decimals === 18) {
      amount = web3.utils.toWei(sendAmount, "ether")
    } else {
      amount = sendAmount*10**assetToSend.decimals
    }

    console.log(exchangeContract.methods.get_dy_underlying)
    console.log(sendIndex)
    console.log(receiveIndex)
    console.log(amount)


    const price = await exchangeContract.methods.get_dy_underlying(sendIndex, receiveIndex, amount).call({ from: account.address })
    console.log(price)

    exchangeContract.methods.exchange_underlying(sendIndex, receiveIndex, amount, price).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
        callback(error)
      })
  }

  getWithdrawPrice = async (payload) => {
    const account = store.getStore('account')
    const { sendAmount } = payload.content
    const poolAssets = store.getStore('poolAssets')

    const web3 = new Web3(store.getStore('web3context').library.provider);
    const exchangeContract = new web3.eth.Contract(config.exchangeContractABI, config.exchangeContractAddress)

    let amount = web3.utils.toWei(sendAmount, "ether")
    let prices = await exchangeContract.methods.calc_withdraw_amount(amount).call({ from: account.address })

    console.log(prices)
    let returnPrices = []
    for (var i = 0; i < prices.length; i++) {
      if(poolAssets[i].decimals === 18) {
        returnPrices.push(parseFloat(web3.utils.fromWei(prices[i], "ether")))
      } else {
        console.log(prices[i])
        console.log(poolAssets[i].decimals)
        returnPrices.push((parseFloat(prices[i])/(10**poolAssets[i].decimals)))
      }
    }

    console.log(returnPrices)

    return emitter.emit(WITHDRAW_PRICE_RETURNED, returnPrices)
  }

  getDepositPrice = async (payload) => {
    const account = store.getStore('account')
    const poolAssets = store.getStore('poolAssets')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const exchangeContract = new web3.eth.Contract(config.exchangeContractABI, config.exchangeContractAddress)

    const amounts = poolAssets.map((asset) => {
      switch (asset.id) {
        case 'DAI':
          return web3.utils.toWei(payload.content.daiAmount, "ether")
        case 'USDC':
          return (payload.content.usdcAmount * 10**asset.decimals) + ''
        case 'USDT':
          return (payload.content.usdtAmount * 10**asset.decimals) + ''
        case 'TUSD':
          return web3.utils.toWei(payload.content.tusdAmount, "ether")
        case 'SUSD':
          return web3.utils.toWei(payload.content.susdAmount, "ether")
        default:
          return 0
      }
    })

    console.log(amounts)
    let minMintAmount = await exchangeContract.methods.calc_deposit_amount(amounts).call({ from: account.address })
    console.log(minMintAmount)
    minMintAmount = web3.utils.fromWei(minMintAmount, "ether")
    console.log(minMintAmount)
    return emitter.emit(DEPOSIT_PRICE_RETURNED, minMintAmount)
  }

  getSPoolBalance = (payload) => {
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const asset = {
      id: 'sCRV',
      erc20address: '0x2b645a6a426f22fb7954dc15e583e3737b8d1434',
      decimals: 18
    }

    this._getERC20Balance(web3, asset, account, (err, balance) => {
      store.setStore({ sCrvBalance: balance })
      console.log(balance)
      return emitter.emit(SPOOL_BALANCE_RETURNED, balance)
    })
  }

  getSPoolRatio = (payload) => {
    const account = { address: '0xeDf54bC005bc2Df0Cc6A675596e843D28b16A966' }
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const curveFi = {
      id: 'curveFiV3',
      erc20address: '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
      decimals: '18'
    }

    const iearnSUSD = {
      id: 'iearnSUSD',
      erc20address: '0xf61718057901f84c4eec4339ef8f0d86d2b45600',
      decimals: '18'
    }

    async.parallel([
      (callback) => { this._getERC20Balance(web3, curveFi, account, callback) },
      (callback) => { this._getERC20Balance(web3, iearnSUSD, account, callback) },
    ], (err, balances) => {

      const ratioCurve = (balances[0]*100/(balances[0]+balances[1])).toFixed(0)
      const ratioIearn = (balances[1]*100/(balances[0]+balances[1])).toFixed(0)

      console.log(ratioCurve)
      console.log(ratioIearn)

      return emitter.emit(GET_SPOOL_RATIO_RETURNED, { ratioCurve, ratioIearn })
    })
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
