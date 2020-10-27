import config from "../config";
import async from 'async';
import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  GET_BALANCES_LIGHT,
  BALANCES_LIGHT_RETURNED,
  GET_VAULT_BALANCES_FULL,
  VAULT_BALANCES_FULL_RETURNED,
  INVEST,
  INVEST_RETURNED,
  REDEEM,
  REDEEM_RETURNED,
  REBALANCE,
  REBALANCE_RETURNED,
  DONATE,
  DONATE_RETURNED,
  GET_AGGREGATED_YIELD,
  GET_AGGREGATED_YIELD_RETURNED,
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
  GET_BEST_PRICE,
  GET_BEST_PRICE_RETURNED,
  GET_VAULT_BALANCES,
  VAULT_BALANCES_RETURNED,
  DEPOSIT_VAULT,
  DEPOSIT_VAULT_RETURNED,
  DEPOSIT_ALL_VAULT,
  DEPOSIT_ALL_VAULT_RETURNED,
  WITHDRAW_VAULT,
  WITHDRAW_VAULT_RETURNED,
  WITHDRAW_ALL_VAULT,
  WITHDRAW_ALL_VAULT_RETURNED,
  GET_DASHBOARD_SNAPSHOT,
  DASHBOARD_SNAPSHOT_RETURNED,
  USD_PRICE_RETURNED,
  GET_STATISTICS,
  STATISTICS_RETURNED,
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
      statistics: [],
      universalGasPrice: '70',
      ethPrice: 0,
      dashboard: this._getDefaultValues().dashboard,
      aprs: this._getDefaultValues().aprs,
      assets: this._getDefaultValues().assets,
      vaultAssets: this._getDefaultValues().vaultAssets,
      usdPrices: null,
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
        {
          website: 'https://alchemyapi.io/',
          logo: 'alchemy.png',
          name: 'Alchemy'
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
        },
        {
          languages: 'European Portuguese',
          code: 'pt'
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
      sCrvBalance:  0
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case GET_BALANCES_LIGHT:
            this.getBalancesLight(payload);
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
          case GET_AGGREGATED_YIELD:
            this.getAPR(payload)
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
          case GET_BEST_PRICE:
            this.getBestPrice(payload)
            break;
          case GET_VAULT_BALANCES:
            this.getVaultBalances(payload);
            break;
          case GET_VAULT_BALANCES_FULL:
            this.getVaultBalancesFull(payload);
            break;
          case DEPOSIT_VAULT:
            this.depositVault(payload)
            break;
          case DEPOSIT_ALL_VAULT:
            this.depositAllVault(payload)
            break;
          case WITHDRAW_VAULT:
            this.withdrawVault(payload)
            break;
          case WITHDRAW_ALL_VAULT:
            this.withdrawAllVault(payload)
            break;
          case GET_DASHBOARD_SNAPSHOT:
            this.getDashboardSnapshot(payload)
            break;
          case GET_STATISTICS:
            this.getStatistics(payload)
            break
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

  resetProfile = () => {
    const defaultvalues = this._getDefaultValues()

    store.setStore({
      aprs: defaultvalues.aprs,
      assets: defaultvalues.assets,
      vaultAssets: defaultvalues.vaultAssets
    })
  }

  _getDefaultValues = () => {
    return {
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
          curve: false,
          price_id: 'dai'
        },
        {
          id: 'USDCv3',
          name: 'USD Coin',
          symbol: 'USDC',
          description: 'USD Coin',
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
          curve: false,
          price_id: 'usd-coin'
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
          price_id: 'tether'
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
          price_id: 'binance-usd'
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
          curve: true,
          price_id: 'dai'
        },
        {
          id: 'USDCv2',
          name: 'USD Coin',
          symbol: 'USDC',
          description: 'USD Coin',
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
          curve: true,
          price_id: 'usd-coin'
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
          price_id: 'tether',
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
          price_id: 'true-usd',
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
          price_id: 'nusd',
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
          price_id: 'wrapped-bitcoin',
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
          price_id: 'dai',
        },
        {
          id: 'USDCv1',
          name: 'USD Coin',
          symbol: 'USDC',
          description: 'USD Coin',
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
          price_id: 'usd-coin',
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
          price_id: 'tether',
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
          price_id: 'nusd',
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
          price_id: 'wrapped-bitcoin',
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
          price_id: 'dai',
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
          price_id: 'ethereum',
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
          idai: true,
          price_id: 'dai',
        },
      ],
      vaultAssets: [
        {
          id: '3Crv',
          name: 'curve.fi/3pool LP',
          symbol: '3Crv',
          description: 'yDAI/yUSDC/yUSDT',
          vaultSymbol: 'y3Crv',
          erc20address: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
          vaultContractAddress: '0x9cA85572E6A3EbF24dEDd195623F188735A5179f',
          vaultContractABI: config.vaultContractV5ABI,
          balance: 0,
          vaultBalance: 0,
          decimals: 18,
          deposit: true,
          depositAll: true,
          withdraw: true,
          withdrawAll: true,
          lastMeasurement: 11039340,
          measurement: 1e18,
          depositDisabled: false,
          price_id: 'curve-fi-ydai-yusdc-yusdt-ytusd', // TODO: Update this when Coingecko adds token
        },
        {
            id: 'CRV',
            name: 'curve.fi/y LP',
            symbol: 'yCRV',
            description: 'yDAI/yUSDC/yUSDT/yTUSD',
            vaultSymbol: 'yUSD',
            erc20address: '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
            vaultContractAddress: '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c',
            vaultContractABI: config.vaultContractABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: false,
            withdraw: true,
            withdrawAll: false,
            lastMeasurement: 10559448,
            measurement: 1e18,
            price_id: 'curve-fi-ydai-yusdc-yusdt-ytusd',
          },
          {
            id: 'crvBUSD',
            name: 'curve.fi/busd LP',
            symbol: 'crvBUSD',
            description: 'yDAI/yUSDC/yUSDT/yBUSD',
            vaultSymbol: 'ycrvBUSD',
            erc20address: '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B',
            vaultContractAddress: '0x2994529c0652d127b7842094103715ec5299bbed',
            vaultContractABI: config.vaultContractV3ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            depositDisabled: false,
            lastMeasurement: 10709740,
            measurement: 1e18,
            price_id: 'lp-bcurve',
            yVaultCheckAddress: '0xe309978497dfc15bb4f04755005f6410cadb4103',
            yVaultCheckDisabled: true
          },
          {
            id: 'crvBTC',
            name: 'curve.fi/sbtc LP',
            symbol: 'crvBTC',
            description: 'renBTC/wBTC/sBTC',
            vaultSymbol: 'ycrvBTC',
            erc20address: '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3',
            vaultContractAddress: '0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6',
            vaultContractABI: config.vaultContractV3ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 10734341,
            measurement: 1e18,
            price_id: 'lp-sbtc-curve'
          },

          {
            id: 'YFI',
            name: 'yearn.finance',
            symbol: 'YFI',
            description: 'yearn.finance',
            vaultSymbol: 'yYFI',
            erc20address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
            vaultContractAddress: '0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1',
            vaultContractABI: config.vaultContractV3ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 10695309,
            measurement: 1e18,
            price_id: 'yearn-finance',
          },
          {
            id: 'DAI',
            name: 'DAI',
            symbol: 'DAI',
            description: 'DAI Stablecoin',
            vaultSymbol: 'yDAI',
            erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            vaultContractAddress: '0xACd43E627e64355f1861cEC6d3a6688B31a6F952',
            vaultContractABI: config.vaultContractV3ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 10650116,
            measurement: 1e18,
            price_id: 'dai',
            yVaultCheckAddress: '0x1bbe0f9af0cf852f9ff14637da2f0bc477a6d1ad',
            yVaultCheckDisabled: true
          },
          {
            id: 'TUSD',
            name: 'TUSD',
            symbol: 'TUSD',
            description: 'TrueUSD',
            vaultSymbol: 'yTUSD',
            erc20address: '0x0000000000085d4780B73119b644AE5ecd22b376',
            vaultContractAddress: '0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a',
            vaultContractABI: config.vaultContractV3ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 10603368,
            measurement: 1e18,
            price_id: 'true-usd',
          },
          {
            id: 'USDC',
            name: 'USD Coin',
            symbol: 'USDC',
            description: 'USD Coin',
            vaultSymbol: 'yUSDC',
            erc20address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            vaultContractAddress: '0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e',
            vaultContractABI: config.vaultContractABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 6,
            deposit: true,
            depositAll: false,
            withdraw: true,
            withdrawAll: false,
            lastMeasurement: 10532708,
            measurement: 1e18,
            price_id: 'usd-coin',
          },
          {
            id: 'USDT',
            name: 'USDT',
            symbol: 'USDT',
            description: 'Tether USD',
            vaultSymbol: 'yUSDT',
            erc20address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            vaultContractAddress: '0x2f08119C6f07c006695E079AAFc638b8789FAf18',
            vaultContractABI: config.vaultContractV3ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 6,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 10651402,
            measurement: 1e18,
            price_id: 'tether',
          },
          {
            id: 'GUSD',
            name: 'Gemini Dollar',
            symbol: 'GUSD',
            description: 'Gemini Dollar',
            vaultSymbol: 'yGUSD',
            erc20address: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
            vaultContractAddress: '0xec0d8D3ED5477106c6D4ea27D90a60e594693C90',
            vaultContractABI: config.vaultContractV3ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 2,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 11065127,
            measurement: 1e18,
            price_id: 'gemini-dollar',
          },
          {
            id: 'aLINK',
            name: 'aLINK',
            symbol: 'aLINK',
            description: 'Aave Interest bearing LINK',
            vaultSymbol: 'yaLINK',
            erc20address: '0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84',
            vaultContractAddress: '0x29E240CFD7946BA20895a7a02eDb25C210f9f324',
            vaultContractABI: config.vaultContractV2ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 10599617,
            measurement: 1e18,
            price_id: 'aave-link',
          },
          {
            id: 'LINK',
            name: 'ChainLink',
            symbol: 'LINK',
            description: 'ChainLink',
            vaultSymbol: 'yLINK',
            erc20address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            vaultContractAddress: '0x881b06da56BB5675c54E4Ed311c21E54C5025298',
            vaultContractABI: config.vaultContractV3ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            depositDisabled: true,
            lastMeasurement: 10604016,
            measurement: 1e18,
            price_id: 'chainlink',
          },
          {
            id: 'WETH',
            name: 'WETH',
            symbol: 'WETH',
            description: 'Wrapped Ether',
            vaultSymbol: 'yWETH',
            erc20address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            vaultContractAddress: '0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7',
            vaultContractABI: config.vaultContractV4ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: true,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 10774489,
            measurement: 1e18,
            depositDisabled: true,
            price_id: 'ethereum',
          },
          {
            id: 'ETH',
            name: 'ETH',
            symbol: 'ETH',
            description: 'Ether',
            vaultSymbol: 'yETH',
            erc20address: 'Ethereum',
            vaultContractAddress: '0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7',
            vaultContractABI: config.vaultContractV4ABI,
            balance: 0,
            vaultBalance: 0,
            decimals: 18,
            deposit: true,
            depositAll: false,
            withdraw: true,
            withdrawAll: true,
            lastMeasurement: 10774489,
            measurement: 1e18,
            depositDisabled: true,
            price_id: 'ethereum',
          },
    ],
      aprs: [{
          token: 'DAI',
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          earnAddress: '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01',
          lastMeasurement: 9465912,
          measurement: 1000037230456849197,
          mod: 1,
          decimals: 18
        },{
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
        },{
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
        },{
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
      dashboard: {
          vault_balance_usd: 0,
          vault_growth_usd_daily: 0,
          vault_growth_usd_weekly: 0,
          vault_growth_usd_yearly: 0,
          vault_growth_usd_daily_perc: 0,
          vault_growth_usd_weekly_perc: 0,
          vault_growth_usd_yearly_perc: 0,

          vault_balance_eth: 0,
          vault_growth_eth_daily: 0,
          vault_growth_eth_weekly: 0,
          vault_growth_eth_yearly: 0,
          vault_growth_eth_daily_perc: 0,
          vault_growth_eth_weekly_perc: 0,
          vault_growth_eth_yearly_perc: 0,


          earn_balance_usd: 0,
          earn_growth_usd_daily: 0,
          earn_growth_usd_weekly: 0,
          earn_growth_usd_yearly: 0,
          earn_growth_usd_daily_perc: 0,
          earn_growth_usd_weekly_perc: 0,
          earn_growth_usd_yearly_perc: 0,

          earn_balance_eth: 0,
          earn_growth_eth_daily: 0,
          earn_growth_eth_weekly: 0,
          earn_growth_eth_yearly: 0,
          earn_growth_eth_daily_perc: 0,
          earn_growth_eth_weekly_perc: 0,
          earn_growth_eth_yearly_perc: 0,

          portfolio_balance_usd: 0,
          portfolio_growth_usd_daily: 0,
          portfolio_growth_usd_weekly: 0,
          portfolio_growth_usd_yearly: 0,
          portfolio_growth_usd_daily_perc: 0,
          portfolio_growth_usd_weekly_perc: 0,
          portfolio_growth_usd_yearly_perc: 0,

          portfolio_balance_eth: 0,
          portfolio_growth_eth_daily: 0,
          portfolio_growth_eth_weekly: 0,
          portfolio_growth_eth_yearly: 0,
          portfolio_growth_eth_daily_perc: 0,
          portfolio_growth_eth_weekly_perc: 0,
          portfolio_growth_eth_yearly_perc: 0,
      }
    }
  }

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

  _checkApprovalForProxy = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)
    try {
      const allowance = await vaultContract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await vaultContract.methods.approve(contract, web3.utils.toWei('999999999999', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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

  _checkApproval = async (asset, account, amount, contract, callback) => {

    if(asset.erc20address === 'Ethereum') {
      return callback()
    }

    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    try {
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      let ethAllowance = web3.utils.fromWei(allowance, "ether")
      if (asset.decimals !== 18) {
        ethAllowance = (allowance*10**asset.decimals).toFixed(0);
      }

      var amountToSend = web3.utils.toWei('999999999', "ether")
      if (asset.decimals !== 18) {
        amountToSend = (999999999*10**asset.decimals).toFixed(0);
      }

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        /*
          code to accomodate for "assert _value == 0 or self.allowances[msg.sender][_spender] == 0" in contract
          We check to see if the allowance is > 0. If > 0 set to 0 before we set it to the correct amount.
        */
        if(['crvV1', 'crvV2', 'crvV3', 'crvV4', 'USDTv1', 'USDTv2', 'USDTv3', 'USDT', 'sCRV'].includes(asset.id) && ethAllowance > 0) {
          await erc20Contract.methods.approve(contract, web3.utils.toWei('0', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        }

        await erc20Contract.methods.approve(contract, amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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
      amountSend = Math.round(amount*10**asset.decimals);
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
      amountSend = Math.round(amount*10**asset.decimals);
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

  getBalancesLight = async () => {
    const account = store.getStore('account')

    const assets = store.getStore('assets')

    if(!account || !account.address) {
      return false
    }

    const web3 = await this._getWeb3Provider();
    if(!web3) {
      return null
    }

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getInvestedBalance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getPoolPrice(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getMaxAPR(web3, asset, account, callbackInner) },
      ], (err, data) => {
        asset.balance = data[0]
        asset.investedBalance = data[1]
        asset.price = data[2]
        asset.maxApr = data[3]

        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ assets: assets })
      return emitter.emit(BALANCES_LIGHT_RETURNED, assets)
    })
  }

  getBalances = async () => {
    const account = store.getStore('account')

    const assets = store.getStore('assets')

    if(!account || !account.address) {
      return false
    }

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
      if(yields && yields.length > 0 && yields[0].apr) {
        const headers = Object.keys(yields[0].apr)
        store.setStore({ aggregatedYields: yields, aggregatedHeaders: headers })
      }
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
    const url = 'https://api-v2.dex.ag/trade?from='+sendAsset.symbol.toLowerCase()+'&to='+receiveAsset.symbol.toLowerCase()+'&fromAmount='+amount+'&dex=ag'
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
    let gasPrice = web3.utils.toWei(await this._getGasPrice(), 'gwei');

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

  getVaultBalancesFull = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('vaultAssets')

    if(!account || !account.address) {
      return false
    }

    const web3 = await this._getWeb3Provider()
    if(!web3) {
      return null
    }

    const vaultStatistics = await this._getStatistics()
    const addressStatistics = await this._getAddressStatistics(account.address)
    const addressTXHitory = await this._getAddressTxHistory(account.address)

    const usdPrices = await this._getUSDPrices()


    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getVaultBalance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getStrategy(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getStatsAPY(vaultStatistics, asset, callbackInner) },
        (callbackInner) => { this._getVaultHoldings(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getAssetUSDPrices(web3, asset, account, usdPrices, callbackInner) },
        (callbackInner) => { this._getVaultAPY(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getAddressStats(addressStatistics, asset, callbackInner) },
        (callbackInner) => { this._getAddressTransactions(addressTXHitory, asset, callbackInner) },
      ], (err, data) => {
        if(err) {
          return callback(err)
        }

        asset.balance = data[0]
        asset.vaultBalance = data[1]
        asset.strategy = data[2].strategy
        asset.strategyHoldings = data[2].holdings
        asset.strategyName = data[2].name
        asset.stats = data[3]
        asset.vaultHoldings = data[4]
        asset.pricePerFullShare = data[5].pricePerFullShare
        asset.usdPrice = data[5].usdPrice
        asset.pricePerFullShare = data[6].pricePerFullShare
        asset.apy = data[6].apy
        asset.addressStatistics = data[7]
        asset.addressTransactions = data[8]

        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }

      store.setStore({ vaultAssets: assets })
      return emitter.emit(VAULT_BALANCES_FULL_RETURNED, assets)
    })
  }

  _getAssetUSDPrices = async (web3, asset, account, usdPrices, callback) => {
    try {
      const vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)
      const pricePerFullShare = await vaultContract.methods.getPricePerFullShare().call({ from: account.address })

      const usdPrice = usdPrices[asset.price_id]

      const returnObj = {
        pricePerFullShare: pricePerFullShare/1e18,
        usdPrice: usdPrice.usd
      }

      callback(null, returnObj)

    } catch (ex) {
      callback(null, {})
    }
  }

  _getStrategy = async (web3, asset, account, callback) => {

    if(['LINK'].includes(asset.id) ) {
      return callback(null, {
        strategy: '',
        name: '',
        holdings: 0
      })
    }

    try {
      const url = config.statsProvider + 'vaults'
      const vaultsApiResultString = await rp(url);
      const vaults = JSON.parse(vaultsApiResultString)
      const vault = vaults.find((vault) => vault.address.toLowerCase() === asset.vaultContractAddress.toLowerCase())

      const strategyAddress = vault["strategyAddress"]
      const strategyName = vault["strategyName"].replace(/^Strategy/, '')

      const strategyContract = new web3.eth.Contract(config.vaultStrategyABI, strategyAddress)
      const holdings = await strategyContract.methods.balanceOf().call({ from: account.address })

      callback(null, {
        strategy: strategyAddress,
        name: strategyName,
        holdings: holdings/(10**(asset.id === 'aLINK' ? 6 : asset.decimals))
      })
    } catch (ex) {
      console.log(asset)
      console.log(ex)
      callback(null, {
        strategy: '',
        name: '',
        holdings: 0
      })
    }
  }

  _getStatsAPY = (vaultStatistics, asset, callback) => {
    try {

      if(asset.erc20address === 'Ethereum') {
        asset.erc20address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      }

      const vault = vaultStatistics.filter((stats) => {
        return stats.tokenAddress.toLowerCase() === asset.erc20address.toLowerCase()
      })

      if(vault.length === 0) {
        return callback(null, {})
      }

      callback(null, vault[0])
    } catch(ex) {
      callback(null, {})
    }
  }

  _getAddressStats = (addressStatistics, asset, callback) => {
    try {
      if(asset.erc20address === 'Ethereum') {
        asset.erc20address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      }

      const vault = addressStatistics.filter((stats) => {
        return stats.vaultAddress.toLowerCase() === asset.vaultContractAddress.toLowerCase()
      })

      if(vault.length === 0) {
        return callback(null, null)
      }

      callback(null, vault[0])
    } catch(ex) {
      callback(null, {})
    }
  }

  _getAddressTransactions = (addressTXHitory, asset, callback) => {
    try {

      if(asset.erc20address === 'Ethereum') {
        asset.erc20address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      }

      const vault = addressTXHitory.filter((stats) => {
        return stats.vaultAddress.toLowerCase() === asset.vaultContractAddress.toLowerCase()
      })

      if(vault.length === 0) {
        return callback(null, {})
      }

      callback(null, vault[0])
    } catch(ex) {
      callback(null, {})
    }
  }

  _getVaultHoldings = async (web3, asset, account, callback) => {
    try {
      let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)
      var balance = await vaultContract.methods.balance().call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      callback(null, 0)
    }
  }

  _getStrategyHoldings = async (web3, asset, account, callback) => {
    try {
      let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)
      let balance = await vaultContract.methods.balance().call({ from: account.address });

      let available = 0
      if(asset.id === 'aLINK') {
        available = await vaultContract.methods.credit().call({ from: account.address });
      } else {
        available = await vaultContract.methods.available().call({ from: account.address });
      }
      balance = parseFloat(balance-available)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      console.log(asset)
      console.log(ex)
    }

  }

  getVaultBalances = async () => {
    const account = store.getStore('account')

    const assets = store.getStore('vaultAssets')

    if(!account || !account.address) {
      return false
    }

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getVaultBalance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getVaultAPY(web3, asset, account, callbackInner) }
      ], (err, data) => {
        if(err) {
          return callback(err)
        }

        asset.balance = data[0]
        asset.vaultBalance = data[1]
        asset.pricePerFullShare = data[2].pricePerFullShare
        asset.apy = data[2].apy

        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ vaultAssets: assets })
      return emitter.emit(VAULT_BALANCES_RETURNED, assets)
    })
  }

  _getVaultBalance = async (web3, asset, account, callback) => {
    if(asset.vaultContractAddress === null) {
      return callback(null, 0)
    }

    try {
      let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)
      var  balance = await vaultContract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      callback(null, 0)
    }
  }

  _getVaultPricePerShare = async (web3, asset, account, callback) => {
    if(asset.vaultContractAddress === null) {
      return callback(null, 0)
    }

    try {
      let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)
      var price = await vaultContract.methods.getPricePerFullShare().call({ from: account.address });
      price = parseFloat(price)/10**18
      callback(null, parseFloat(price))
    } catch(ex) {
      console.log(ex)
      callback(null, 0)
    }
  }

  depositVault = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._checkApproval(asset, account, amount, asset.vaultContractAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callDepositVault(asset, account, amount, (err, depositResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(DEPOSIT_VAULT_RETURNED, depositResult)
      })
    })
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
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

  _callDepositVault = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountToSend = amount*10**asset.decimals;
    }

    if(asset.erc20address === 'Ethereum') {
      vaultContract.methods.depositETH().send({ from: account.address, value: amountToSend, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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
  }

  depositAllVault = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._checkApproval(asset, account, asset.balance, asset.vaultContractAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callDepositAllVault(asset, account, (err, depositResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(DEPOSIT_ALL_VAULT_RETURNED, depositResult)
      })
    })
  }

  _callDepositAllVault = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)

    vaultContract.methods.depositAll().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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

  withdrawVault = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content


    if(asset.yVaultCheckAddress && !asset.yVaultCheckDisabled) {
      this._checkApprovalForProxy(asset, account, amount, asset.yVaultCheckAddress, (err) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        this._callWithdrawVaultProxy(asset, account, amount, (err, withdrawResult) => {
          if(err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(WITHDRAW_VAULT_RETURNED, withdrawResult)
        })
      })
    } else {
      this._callWithdrawVault(asset, account, amount, (err, withdrawResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }
        return emitter.emit(WITHDRAW_VAULT_RETURNED, withdrawResult)
      })
    }
  }

  _callWithdrawVaultProxy = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let yVaultCheckContract = new web3.eth.Contract(config.yVaultCheckABI, asset.yVaultCheckAddress)

    var amountSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountSend = Math.round(amount*10**asset.decimals);
    }

    yVaultCheckContract.methods.withdraw(amountSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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

  _callWithdrawVault = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)

    var amountSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountSend = Math.round(amount*10**asset.decimals);
    }

    let functionCall = vaultContract.methods.withdraw(amountSend)
    if(asset.erc20address === 'Ethereum') {
      functionCall = vaultContract.methods.withdrawETH(amountSend)
    }

    functionCall.send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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

  withdrawAllVault = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    if(asset.yVaultCheckAddress && !asset.yVaultCheckDisabled) {
      this._checkApprovalForProxy(asset, account, asset.vaultBalance, asset.yVaultCheckAddress, (err) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        this._callWithdrawAllVaultProxy(asset, account, (err, withdrawResult) => {
          if(err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(WITHDRAW_ALL_VAULT_RETURNED, withdrawResult)
        })
      })
    } else {
      this._callWithdrawAllVault(asset, account, (err, withdrawResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }
        return emitter.emit(WITHDRAW_ALL_VAULT_RETURNED, withdrawResult)
      })
    }
  }

  _callWithdrawAllVaultProxy = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let vaultContract = new web3.eth.Contract(config.yVaultCheckABI, asset.yVaultCheckAddress)

    vaultContract.methods.withdrawAll().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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

  _callWithdrawAllVault = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let vaultContract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress)

    let functionCall = vaultContract.methods.withdrawAll()
    if(asset.erc20address === 'Ethereum') {
      functionCall = vaultContract.methods.withdrawAllETH()
    }

    functionCall.send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
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

  _getVaultAPY = async (web3, asset, account, callback) => {
    try {
      if(asset.vaultContractAddress === null) {
        return callback(null, {
          pricePerFullShare: 0,
          apy: 0
        })
      }

      const block = await web3.eth.getBlockNumber();
      const contract = new web3.eth.Contract(asset.vaultContractABI, asset.vaultContractAddress);
      let pricePerFullShare = await contract.methods.getPricePerFullShare().call();

      let balance = pricePerFullShare - asset.measurement;
      balance = balance / 1e18;
      let diff = block - asset.lastMeasurement;

      if(diff === 0) {
        return callback(null, {
          pricePerFullShare: 0,
          apy: 0
        })
      }

      balance = balance / diff;
      balance = balance * 242584600;

      const returnObj = {
        pricePerFullShare: parseFloat(pricePerFullShare)/10**18,
        apy: parseFloat(balance)
      }

      callback(null, returnObj)
    } catch (e) {
      console.log(e)
      callback(null, {
        pricePerFullShare: 0,
        apy: 0
      })
    }
  }

  getUSDPrices = async () => {
    try {
      const priceJSON = await this._getUSDPrices()

      store.setStore({ usdPrices: priceJSON })
      return emitter.emit(USD_PRICE_RETURNED, priceJSON)

    } catch(e) {
      console.log(e)
    }
  }

  _getUSDPrices = async () => {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,dai,true-usd,tether,usd-coin,chainlink,yearn-finance,binance-usd,wrapped-bitcoin,ethereum,nusd,chainlink,aave-link,lp-sbtc-curve,lp-bcurve,curve-fi-ydai-yusdc-yusdt-ytusd,gemini-dollar&vs_currencies=usd,eth'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)

      return priceJSON
    } catch(e) {
      console.log(e)
      return null
    }
  }

  getDashboardSnapshot = (payload) => {
    emitter.on(VAULT_BALANCES_FULL_RETURNED, this._calculateDashboard)
    emitter.on(BALANCES_LIGHT_RETURNED, this._calculateDashboard)
    emitter.on(USD_PRICE_RETURNED, this._calculateDashboard)
    emitter.on(STATISTICS_RETURNED, this._calculateDashboard)

    this.getVaultBalancesFull()
    this.getBalancesLight()
    this.getUSDPrices()
    this.getStatistics()
  }

  _calculateDashboard = () => {
    const vaults = store.getStore('vaultAssets')
    const assets = store.getStore('assets')
    const prices = store.getStore('usdPrices')
    const statistics = store.getStore('statistics')

    if(vaults && vaults.length > 0 && assets && assets.length > 0 && prices !== null && statistics && statistics.length > 0) {
      let basedOn = localStorage.getItem('yearn.finance-dashboard-basedon')

      if(!basedOn) {
        basedOn = '1'
      }

      // FILTER USED VAULTS AND CALCULATE VAULT ASSET BALANCES
      const vaultsInUse = vaults.filter((vault) => {
        if(vault.id === 'ETH') {
          return false
        }

        return vault.vaultBalance > 0.0001
      }).map((vault) => {

        let apy = 0

        const vaultStats = statistics.filter((stats) => {
          return stats.tokenAddress.toLowerCase() === vault.erc20address.toLowerCase()
        })

        if(vaultStats.length === 0) {
          apy = vault.apy
        } else {
          switch (basedOn) {
            case '1':
              apy = vaultStats[0].apyOneWeekSample
              break;
            case '2':
              apy = vaultStats[0].apyOneMonthSample
              break;
            case '3':
              apy = vaultStats[0].apyInceptionSample
              break;
            default:
              apy = vault.apy
          }
        }

        const price = prices[vault.price_id]
        vault.prices = price
        vault.usdBalance = vault.vaultBalance * vault.pricePerFullShare * vault.prices.usd
        vault.vaultGrowth_daily_usd = vault.vaultBalance * vault.pricePerFullShare * (apy/36500) * vault.prices.usd
        vault.vaultGrowth_weekly_usd = vault.vaultBalance * vault.pricePerFullShare * (apy/5200) * vault.prices.usd
        vault.vaultGrowth_yearly_usd = vault.vaultBalance * vault.pricePerFullShare * apy/100 * vault.prices.usd

        vault.ethBalance = vault.vaultBalance * vault.pricePerFullShare * vault.prices.eth
        vault.vaultGrowth_daily_eth = vault.vaultBalance * vault.pricePerFullShare * (apy/36500) * vault.prices.eth
        vault.vaultGrowth_weekly_eth = vault.vaultBalance * vault.pricePerFullShare * (apy/5200) * vault.prices.eth
        vault.vaultGrowth_yearly_eth = vault.vaultBalance * vault.pricePerFullShare * apy/100 * vault.prices.eth

        return vault
      })

      // CALCULATE VAULT BALANCES AND DAILY GROWTH
      const vaultBalances = vaultsInUse.reduce((accumulator, vault) => {
        accumulator.vaultBalance_usd = accumulator.vaultBalance_usd + vault.usdBalance
        accumulator.vaultGrowth_daily_usd = accumulator.vaultGrowth_daily_usd + vault.vaultGrowth_daily_usd
        accumulator.vaultGrowth_weekly_usd = accumulator.vaultGrowth_weekly_usd + vault.vaultGrowth_weekly_usd
        accumulator.vaultGrowth_yearly_usd = accumulator.vaultGrowth_yearly_usd + vault.vaultGrowth_yearly_usd

        accumulator.vaultBalance_eth = accumulator.vaultBalance_eth + vault.ethBalance
        accumulator.vaultGrowth_daily_eth = accumulator.vaultGrowth_daily_eth + vault.vaultGrowth_daily_eth
        accumulator.vaultGrowth_weekly_eth = accumulator.vaultGrowth_weekly_eth + vault.vaultGrowth_weekly_eth
        accumulator.vaultGrowth_yearly_eth = accumulator.vaultGrowth_yearly_eth + vault.vaultGrowth_yearly_eth
        return accumulator
      }, {
        vaultBalance_usd: 0,
        vaultGrowth_daily_usd: 0,
        vaultGrowth_weekly_usd: 0,
        vaultGrowth_yearly_usd: 0,
        vaultBalance_eth: 0,
        vaultGrowth_daily_eth: 0,
        vaultGrowth_weekly_eth: 0,
        vaultGrowth_yearly_eth: 0
      })

      // CALCULATE VAULT GROWth PERCENTAGES
      const vaultGrowthDailyPerc_usd = vaultBalances.vaultGrowth_daily_usd * 100 / vaultBalances.vaultBalance_usd
      const vaultGrowthWeeklyPerc_usd = vaultBalances.vaultGrowth_weekly_usd * 100 / vaultBalances.vaultBalance_usd
      const vaultGrowthYearlyPerc_usd = vaultBalances.vaultGrowth_yearly_usd * 100 / vaultBalances.vaultBalance_usd

      const vaultGrowthDailyPerc_eth = vaultBalances.vaultGrowth_daily_eth * 100 / vaultBalances.vaultBalance_eth
      const vaultGrowthWeeklyPerc_eth = vaultBalances.vaultGrowth_weekly_eth * 100 / vaultBalances.vaultBalance_eth
      const vaultGrowthYearlyPerc_eth = vaultBalances.vaultGrowth_yearly_eth * 100 / vaultBalances.vaultBalance_eth


      // FILTER USED EARN AND CALCULATE EARN ASSET BALANCES
      const assetsInUse = assets.filter((asset) => {
        return asset.investedBalance > 0.0001
      }).map((asset) => {
        const price = prices[asset.price_id]
        if(price == null) {
          console.log(asset.price_id)
        }
        asset.prices = price
        asset.usdBalance = asset.investedBalance * asset.price * asset.prices.usd
        asset.earnGrowth_daily_usd = asset.investedBalance * asset.price * (asset.maxApr/36500) * asset.prices.usd
        asset.earnGrowth_weekly_usd = asset.investedBalance * asset.price * (asset.maxApr/5200) * asset.prices.usd
        asset.earnGrowth_yearly_usd = asset.investedBalance * asset.price * asset.maxApr/100 * asset.prices.usd

        asset.ethBalance = asset.investedBalance * asset.price * asset.prices.eth
        asset.earnGrowth_daily_eth = asset.investedBalance * asset.price * (asset.maxApr/36500) * asset.prices.eth
        asset.earnGrowth_weekly_eth = asset.investedBalance * asset.price * (asset.maxApr/5200) * asset.prices.eth
        asset.earnGrowth_yearly_eth = asset.investedBalance * asset.price * asset.maxApr/100 * asset.prices.eth
        return asset
      })


      // CALCULATE EARN BALANCES AND DAILY GROWTH
      const earnBalances = assetsInUse.reduce((accumulator, asset) => {
        accumulator.earnBalance_usd = accumulator.earnBalance_usd + asset.usdBalance
        accumulator.earnGrowth_daily_usd = accumulator.earnGrowth_daily_usd + asset.earnGrowth_daily_usd
        accumulator.earnGrowth_weekly_usd = accumulator.earnGrowth_weekly_usd + asset.earnGrowth_weekly_usd
        accumulator.earnGrowth_yearly_usd = accumulator.earnGrowth_yearly_usd + asset.earnGrowth_yearly_usd

        accumulator.earnBalance_eth = accumulator.earnBalance_eth + asset.ethBalance
        accumulator.earnGrowth_daily_eth = accumulator.earnGrowth_daily_eth + asset.earnGrowth_daily_eth
        accumulator.earnGrowth_weekly_eth = accumulator.earnGrowth_weekly_eth + asset.earnGrowth_weekly_eth
        accumulator.earnGrowth_yearly_eth = accumulator.earnGrowth_yearly_eth + asset.earnGrowth_yearly_eth
        return accumulator
      }, {
        earnBalance_usd: 0,
        earnGrowth_daily_usd: 0,
        earnGrowth_weekly_usd: 0,
        earnGrowth_yearly_usd: 0,
        earnBalance_eth: 0,
        earnGrowth_daily_eth: 0,
        earnGrowth_weekly_eth: 0,
        earnGrowth_yearly_eth: 0
      })

      // CALCULATE EARN GROWth PERCENTAGES
      const earnGrowthDailyPerc_usd = earnBalances.earnGrowth_daily_usd * 100 / earnBalances.earnBalance_usd
      const earnGrowthWeeklyPerc_usd = earnBalances.earnGrowth_weekly_usd * 100 / earnBalances.earnBalance_usd
      const earnGrowthYearlyPerc_usd = earnBalances.earnGrowth_yearly_usd * 100 / earnBalances.earnBalance_usd

      const earnGrowthDailyPerc_eth = earnBalances.earnGrowth_daily_eth * 100 / earnBalances.earnBalance_eth
      const earnGrowthWeeklyPerc_eth = earnBalances.earnGrowth_weekly_eth * 100 / earnBalances.earnBalance_eth
      const earnGrowthYearlyPerc_eth = earnBalances.earnGrowth_yearly_eth * 100 / earnBalances.earnBalance_eth




      // CALCULATE PORTFOLIO (earn + vault) BALANCES
      const portfolioBalance_usd = vaultBalances.vaultBalance_usd + earnBalances.earnBalance_usd
      const portfolioGrowthDaily_usd = vaultBalances.vaultGrowth_daily_usd + earnBalances.earnGrowth_daily_usd
      const portfolioGrowthWeekly_usd = vaultBalances.vaultGrowth_weekly_usd + earnBalances.earnGrowth_weekly_usd
      const portfolioGrowthYearly_usd = vaultBalances.vaultGrowth_yearly_usd + earnBalances.earnGrowth_yearly_usd
      const portfolioGrowthDailyPerc_usd = (vaultBalances.vaultGrowth_daily_usd + earnBalances.earnGrowth_daily_usd) * 100 / (vaultBalances.vaultBalance_usd + earnBalances.earnBalance_usd)
      const portfolioGrowthWeeklyPerc_usd = (vaultBalances.vaultGrowth_weekly_usd + earnBalances.earnGrowth_weekly_usd) * 100 / (vaultBalances.vaultBalance_usd + earnBalances.earnBalance_usd)
      const portfolioGrowthYearlyPerc_usd = (vaultBalances.vaultGrowth_yearly_usd + earnBalances.earnGrowth_yearly_usd) * 100 / (vaultBalances.vaultBalance_usd + earnBalances.earnBalance_usd)


      const portfolioBalance_eth = vaultBalances.vaultBalance_eth + earnBalances.earnBalance_eth
      const portfolioGrowthDaily_eth = vaultBalances.vaultGrowth_daily_eth + earnBalances.earnGrowth_daily_eth
      const portfolioGrowthWeekly_eth = vaultBalances.vaultGrowth_weekly_eth + earnBalances.earnGrowth_weekly_eth
      const portfolioGrowthYearly_eth = vaultBalances.vaultGrowth_yearly_eth + earnBalances.earnGrowth_yearly_eth
      const portfolioGrowthDailyPerc_eth = (vaultBalances.vaultGrowth_daily_eth + earnBalances.earnGrowth_daily_eth) * 100 / (vaultBalances.vaultBalance_eth + earnBalances.earnBalance_eth)
      const portfolioGrowthWeeklyPerc_eth = (vaultBalances.vaultGrowth_weekly_eth + earnBalances.earnGrowth_weekly_eth) * 100 / (vaultBalances.vaultBalance_eth + earnBalances.earnBalance_eth)
      const portfolioGrowthYearlyPerc_eth = (vaultBalances.vaultGrowth_yearly_eth + earnBalances.earnGrowth_yearly_eth) * 100 / (vaultBalances.vaultBalance_eth + earnBalances.earnBalance_eth)


      let dashboard = {
        vault_balance_usd: vaultBalances.vaultBalance_usd,
        vault_growth_usd_daily: vaultBalances.vaultGrowth_daily_usd,
        vault_growth_usd_weekly: vaultBalances.vaultGrowth_weekly_usd,
        vault_growth_usd_yearly: vaultBalances.vaultGrowth_yearly_usd,
        vault_growth_usd_daily_perc: vaultGrowthDailyPerc_usd,
        vault_growth_usd_weekly_perc: vaultGrowthWeeklyPerc_usd,
        vault_growth_usd_yearly_perc: vaultGrowthYearlyPerc_usd,

        vault_balance_eth: vaultBalances.vaultBalance_eth,
        vault_growth_eth_daily: vaultBalances.vaultGrowth_daily_eth,
        vault_growth_eth_weekly: vaultBalances.vaultGrowth_weekly_eth,
        vault_growth_eth_yearly: vaultBalances.vaultGrowth_yearly_eth,
        vault_growth_eth_daily_perc: vaultGrowthDailyPerc_eth,
        vault_growth_eth_weekly_perc: vaultGrowthWeeklyPerc_eth,
        vault_growth_eth_yearly_perc: vaultGrowthYearlyPerc_eth,


        earn_balance_usd: earnBalances.earnBalance_usd,
        earn_growth_usd_daily: earnBalances.earnGrowth_daily_usd,
        earn_growth_usd_weekly: earnBalances.earnGrowth_weekly_usd,
        earn_growth_usd_yearly: earnBalances.earnGrowth_yearly_usd,
        earn_growth_usd_daily_perc: earnGrowthDailyPerc_usd,
        earn_growth_usd_weekly_perc: earnGrowthWeeklyPerc_usd,
        earn_growth_usd_yearly_perc: earnGrowthYearlyPerc_usd,

        earn_balance_eth: earnBalances.earnBalance_eth,
        earn_growth_eth_daily: earnBalances.earnGrowth_daily_eth,
        earn_growth_eth_weekly: earnBalances.earnGrowth_weekly_eth,
        earn_growth_eth_yearly: earnBalances.earnGrowth_yearly_eth,
        earn_growth_eth_daily_perc: earnGrowthDailyPerc_eth,
        earn_growth_eth_weekly_perc: earnGrowthWeeklyPerc_eth,
        earn_growth_eth_yearly_perc: earnGrowthYearlyPerc_eth,

        portfolio_balance_usd: portfolioBalance_usd,
        portfolio_growth_usd_daily: portfolioGrowthDaily_usd,
        portfolio_growth_usd_weekly: portfolioGrowthWeekly_usd,
        portfolio_growth_usd_yearly: portfolioGrowthYearly_usd,
        portfolio_growth_usd_daily_perc: portfolioGrowthDailyPerc_usd,
        portfolio_growth_usd_weekly_perc: portfolioGrowthWeeklyPerc_usd,
        portfolio_growth_usd_yearly_perc: portfolioGrowthYearlyPerc_usd,

        portfolio_balance_eth: portfolioBalance_eth,
        portfolio_growth_eth_daily: portfolioGrowthDaily_eth,
        portfolio_growth_eth_weekly: portfolioGrowthWeekly_eth,
        portfolio_growth_eth_yearly: portfolioGrowthYearly_eth,
        portfolio_growth_eth_daily_perc: portfolioGrowthDailyPerc_eth,
        portfolio_growth_eth_weekly_perc: portfolioGrowthWeeklyPerc_eth,
        portfolio_growth_eth_yearly_perc: portfolioGrowthYearlyPerc_eth,

        vaults: vaultsInUse,
        assets: assetsInUse,
        statistics: statistics
      }

      store.setStore({ dashboard: dashboard })
      emitter.emit(DASHBOARD_SNAPSHOT_RETURNED, dashboard)

    }
  }

  getStatistics = async () => {
    try {
      const statistics = await this._getStatistics()

      store.setStore({ statistics: statistics })
      emitter.emit(STATISTICS_RETURNED, statistics)
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }

  _getStatistics = async () => {
    try {
      const url = config.statsProvider+'vaults/apy'
      const statisticsString = await rp(url);
      const statistics = JSON.parse(statisticsString)

      return statistics
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }

  _getAddressStatistics = async (address) => {
    try {
      const url = config.statsProvider+'user/'+address+'/vaults/statistics'
      const statisticsString = await rp(url);
      const statistics = JSON.parse(statisticsString)

      return statistics
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }

  _getAddressTxHistory = async (address) => {
    try {
      const url = config.statsProvider+'user/'+address+'/vaults/transactions'
      const statisticsString = await rp(url);
      const statistics = JSON.parse(statisticsString)

      return statistics
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
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

  _getWeb3Provider = async () => {
    const web3context = store.getStore('web3context')
    if(!web3context) {
      return null
    }
    const provider = web3context.library.provider
    if(!provider) {
      return null
    }

    const web3 = new Web3(provider);

    // const web3 = createAlchemyWeb3(config.infuraProvider, { writeProvider: provider });

    return web3
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
