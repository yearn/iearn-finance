import config from "../config";
import async from 'async';
import {
  ERROR,
  CONNECT_LEDGER,
  LEDGER_CONNECTED,
  CONNECT_METAMASK,
  CONNECT_METAMASK_PASSIVE,
  METAMASK_CONNECTED,
  GET_BALANCES,
  BALANCES_RETURNED,
  INVEST,
  INVEST_RETURNED,
  REDEEM,
  REDEEM_RETURNED,
  GET_YIELD,
  GET_YIELD_RETURNED,
  GET_UNISWAP_YIELD,
  GET_UNISWAP_YIELD_RETURNED,
  GET_AGGREGATED_YIELD,
  GET_AGGREGATED_YIELD_RETURNED,
  GET_UNISWAP_COMPARRISONS,
  GET_UNISWAP_COMPARRISONS_RETURNED,
  GET_CONTRACT_EVENTS,
  GET_CONTRACT_EVENTS_RETURNED
} from '../constants';
import Web3 from 'web3';
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import {
  injected,
  network,
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


const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();


class Store {
  constructor() {

    this.store = {
      assets: [
        {
          name: 'DAI',
          symbol: 'DAI',
          description: 'DAI Stablecoin',
          investSymbol: 'yDAI',
          erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          iEarnContract: '0x9D25057e62939D3408406975aD75Ffe834DA4cDd',
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          decimals: 18,
          price: 0,
          poolValue: 0,
          abi: config.IEarnERC20ABI
        },
        {
          name: 'USD Coin',
          symbol: 'USDC',
          description: 'USD//C',
          investSymbol: 'yUSDC',
          erc20address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          iEarnContract: '0xa2609B2b43AC0F5EbE27deB944d2a399C201E3dA',
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 6,
          poolValue: 0,
          abi: config.IEarnERC20ABI
        },
        {
          name: 'USDT',
          symbol: 'USDT',
          description: 'Tether USD',
          investSymbol: 'yUSDC',
          erc20address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          iEarnContract: '0xa1787206d5b1bE0f432C4c4f96Dc4D1257A1Dd14',
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 6,
          poolValue: 0,
          abi: config.IEarnERC20ABI
        },
        {
          name: 'SUSD',
          symbol: 'SUSD',
          description: 'Synth sUSD',
          investSymbol: 'ySUSD',
          erc20address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
          iEarnContract: '0x36324b8168f960A12a8fD01406C9C78143d41380',
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 18,
          poolValue: 0,
          abi: config.IEarnERC20ABI
        },
        {
          name: 'cDAI/cUSDC',
          symbol: 'CRV',
          tokenSymbol: 'DAI',
          description: 'Curve.fi cDAI/cUSDC',
          investSymbol: 'yCRV',
          erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          iEarnContract: '0x9Ce551A9D2B1A4Ec0cc6eB0E0CC12977F6ED306C',
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 18,
          poolValue: 0,
          abi: config.IEarnERC20ABI
        },
        {
          name: 'wBTC',
          symbol: 'wBTC',
          tokenSymbol: 'wBTC',
          description: 'Wrapped BTC',
          investSymbol: 'yBTC',
          erc20address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          iEarnContract: '0x04EF8121aD039ff41d10029c91EA1694432514e9',
          apr: 0,
          maxApr: 0,
          balance: 0,
          investedBalance: 0,
          price: 0,
          decimals: 8,
          poolValue: 0,
          abi: config.IEarnERC20ABI
        },
        {
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
          abi: config.IEarnABI
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
        Injected: injected,
        Network: network,
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
      }
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
          case GET_YIELD:
            this.getYield(payload);
            break;
          case GET_UNISWAP_YIELD:
            this.getUniswapYield(payload)
            break;
          case GET_AGGREGATED_YIELD:
            this.getAggregatedYield(payload)
            break;
          case GET_UNISWAP_COMPARRISONS:
            this.getUniswapComparrisons(payload)
            break;
          case GET_CONTRACT_EVENTS:
            this.getContractEvents(payload)
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
    console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  getWeb3 = () => {
    const { ethereum } = window;
    const web3 = new Web3(ethereum);
    return web3
  }

  connectLedger(payload) {
    const engine = new ProviderEngine();
    const getTransport = () => TransportU2F.create();
    const ledger = createLedgerSubprovider(getTransport, {
      accountsLength: 5
    });
    engine.addProvider(ledger);
    engine.addProvider(new RpcSubprovider({ rpcUrl: config.infuraProvider }));
    engine.start();
    const web3 = new Web3(engine);

    console.log(`Web3 connected using infura provider: ${config.infuraProvider}`)

    try {
      console.log(`Getting accounts from ledger`)

      web3.eth.getAccounts(function(err, accounts){
        if (err != null) {
          return emitter.emit(ERROR, err);
        } else if (accounts.length === 0) {
          console.log('No accounts found via Ledger!')
          return emitter.emit(ERROR, 'No accounts found via Ledger!');
        } else {
          console.log(`Found accounts, storing address and web3: ${accounts[0]}`)
          store.setStore({ account: { address: accounts[0] }})
          store.setStore({ web3: web3 })

          console.log(`Getting balances`)
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })

          return emitter.emit(LEDGER_CONNECTED)
        }
      });
    } catch (e) {
      console.log('Access denied. Please allow access via your Ledger device!')
      return emitter.emit(ERROR, 'Access denied. Please allow access via your Ledger device!');
    }
  }

  async connectMetamask(payload) {
    let web3 = null

    if (typeof window.ethereum !== 'undefined') {
      web3 = new Web3(window.ethereum);

      try {
        // Request account access if needed
        await window.ethereum.enable();

        web3.eth.getAccounts(function(err, accounts){
          if (err != null) {
            return emitter.emit(ERROR, err);
          } else if (accounts.length === 0) {
            console.log('MetaMask is locked. Please allow access via the Metamask Extension!')
            return emitter.emit(ERROR, 'MetaMask is locked. Please allow access via the Metamask Extension!');
          } else {
            store.setStore({ account: { address: accounts[0] }})
            store.setStore({ web3: web3 })

            return emitter.emit(METAMASK_CONNECTED)
          }
        });

      } catch (error) {
        console.log('Access denied. Please allow access via the Metamask Extension!')
        return emitter.emit(ERROR, 'Access denied. Please allow access via the Metamask Extension!');
      }
    } else {
      console.log('No web3? You should consider trying MetaMask!')
      return emitter.emit(ERROR, 'No web3? You should consider trying MetaMask!');
    }
  }

  async connectMetamaskPassive(payload) {
    let web3 = null

    if (typeof window.ethereum !== 'undefined') {
      web3 = new Web3(window.ethereum);

      try {
        web3.eth.getAccounts(function(err, accounts){
          if (err != null) {

          } else if (accounts.length === 0) {

          } else {
            store.setStore({ account: { address: accounts[0] }})
            store.setStore({ web3: web3 })

            dispatcher.dispatch({ type: GET_BALANCES, content: {} })

            return emitter.emit(METAMASK_CONNECTED)
          }
        });

      } catch (error) {

      }
    }
  }

  invest = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    if(asset.erc20address !== 'Ethereum') {
      this._checkApproval(asset, account, amount, (err) => {
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

  _checkApproval = async (asset, account, amount, callback) => {
    const web3 = this.getWeb3()
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)

    try {
      const allowance = await erc20Contract.methods.allowance(account.address, asset.iEarnContract).call({ from: account.address })

      if(parseFloat(allowance) < parseFloat(amount)) {
        const allowanceSet = await erc20Contract.methods.approve(asset.iEarnContract, web3.utils.toWei(amount, "ether")).send({ from: account.address })
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

  _callInvest = async (asset, account, amount, callback) => {
    const web3 = this.getWeb3()

    let iEarnContract = new web3.eth.Contract(asset.abi, asset.iEarnContract)

    if(asset.erc20address === 'Ethereum') {
      iEarnContract.methods.invest().send({ from: account.address, value: web3.utils.toWei(amount, "ether") })
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
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        })
        .catch((error) => {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        })
    } else {
      var amountToSend = web3.utils.toWei(amount, "ether")
      if (asset.decimals != 18) {
        amountToSend = amount*10**asset.decimals;
      }
      iEarnContract.methods.invest(amountToSend).send({ from: account.address })
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
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        })
        .catch((error) => {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        })
    }
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
    const web3 = this.getWeb3()

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)

    var amountSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountSend = amount*10**asset.decimals;
    }

    iEarnContract.methods.redeem(amountSend).send({ from: account.address })
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
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    })
  }

  getBalances = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('assets')

    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getInvestedBalance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getPoolPrice(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getMaxAPR(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getPoolValue(web3, asset, account, callbackInner) },
      ], (err, data) => {
        asset.balance = data[0]
        asset.investedBalance = data[1]
        asset.price = data[2]
        asset.maxApr = data[3]
        asset.poolValue = data[4]

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

  _getPoolValue = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, asset)
    }

    try {
      let iEarnContract = new web3.eth.Contract(asset.abi, asset.iEarnContract)
      let value = 0

      if(asset.erc20address === 'Ethereum') {
        value = web3.utils.fromWei(await iEarnContract.methods.calcPoolValueInETH().call({ from: account.address }), 'ether');
      } else {
        value = web3.utils.fromWei(await iEarnContract.methods.calcPoolValueInToken().call({ from: account.address }), 'ether');
      }
      callback(null, parseFloat(value))
    } catch (e) {
      console.log(e)
      callback(null, 0)
    }

  }

  _getPoolPrice = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, asset)
    }

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)
    const balance = web3.utils.fromWei(await iEarnContract.methods.getPricePerFullShare().call({ from: account.address }), 'ether');
    callback(null, parseFloat(balance))
  }

  _getInvestedBalance = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, asset)
    }

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)
    var  balance = await iEarnContract.methods.balanceOf(account.address).call({ from: account.address });
    balance = parseFloat(balance)/10**asset.decimals
    callback(null, parseFloat(balance))
  }

  _getMaxAPR = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, asset)
    }
    if (asset.symbol == 'CRV') {
      let aprContract = new web3.eth.Contract(config.crvContractABI, config.crvAddress)
      const call = 'crvapr'
      const aprs = await aprContract.methods[call]().call();
      console.log(aprs)
      return callback(null, web3.utils.fromWei(parseFloat(aprs).toFixed(0), 'ether'))
    }

    let aprContract = new web3.eth.Contract(config.aggregatedContractABI, config.aggregatedContractAddress)

    var call = 'getAPROptions';//+asset.symbol
    var address = asset.erc20address
    var aprs = 0;
    if (asset.erc20address == 'Ethereum') {
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
      if(o === 'uniapr' || o === 'unicapr') {
        return aprs[o]-100000000000000000000
      }
      return aprs[o];
    }))

    callback(null, web3.utils.fromWei(maxApr.toFixed(0), 'ether'))
  }

  getYield = (payload) => {

    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));

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
    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));
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

      console.log(liq)

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
    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));

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
    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));

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
    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));
    let iEarnContract = new web3.eth.Contract(config.IEarnABI, config.iEarnContract)

    iEarnContract.getPastEvents('allEvents', { fromBlock: 1, toBlock: 'latest' })
      .then((res) => {

        const sorted = res.sort((a, b) => {
          return parseFloat(a.blockNumber) - parseFloat(b.blockNumber)
        }).filter((tx) => {
          if(tx.event !== 'Transfer') {
            return false
          }

          if(!tx.returnValues.value || tx.returnValues.value == 0) {
            return false
          }

          if(tx.returnValues.from != '0x0000000000000000000000000000000000000000') {
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
            //TODO: Figure out how to merge the values into 1

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
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
