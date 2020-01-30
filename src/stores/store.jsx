import config from "../config";
import async from 'async';
import {
  ERROR,
  CONNECT_METAMASK,
  CONNECT_METAMASK_PASSIVE,
  METAMASK_CONNECTED,
  GET_BALANCES,
  BALANCES_RETURNED,
  GET_PRICES,
  PRICES_RETURNED,
  GET_INVESTED_BALANCES,
  INVESTED_BALANCES_RETURNED,
  GET_POOL_VALUES,
  POOL_VALUES_RETURNED,
  INVEST,
  INVEST_RETURNED,
  REDEEM,
  REDEEM_RETURNED,
  GET_ETH_BALANCE,
  ETH_BALANCE_RETURNED,
  GET_IETH_BALANCE,
  IETH_BALANCE_RETURNED,
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

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      assets: [
        {
          erc20address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          iEarnContract: null,
          name: 'USD Tether',
          symbol: 'USDT',
          apr: 8,
          balance: 0.00
        },
        {
          erc20address: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
          iEarnContract: null,
          name: 'Compound USD',
          symbol: 'USDC',
          apr: 8,
          balance: 0.00
        },
        {
          erc20address: '0x0000000000085d4780B73119b644AE5ecd22b376',
          iEarnContract: null,
          name: 'True USD',
          symbol: 'TUSD',
          apr: 8,
          balance: 0.00
        },
        {
          erc20address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
          iEarnContract: null,
          name: 'SAI',
          symbol: 'SAI',
          apr: 8,
          balance: 0.00
        },
        {
          erc20address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
          iEarnContract: null,
          name: 'Paxos Standard',
          symbol: 'PAX',
          apr: 8,
          balance: 0.00
        },
        {
          erc20address: 'Ethereum',
          iEarnContract: '0x9Dde7cdd09dbed542fC422d18d89A589fA9fD4C0',
          name: 'Ethereum',
          symbol: 'ETH',
          apr: 4,
          balance: 0.00
        },
        {
          erc20address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
          iEarnContract: null,
          name: 'Fantom',
          symbol: 'FTM',
          apr: 4,
          balance: 0.00
        },
      ],
      investedAssets: [
        {
          iEarnContract: null,
          name: 'Interest Bearing USD',
          symbol: 'iUSD',
          apr: 8,
          balance: 0.00,
          price: 0.00,
          pool_value: 0.00
        },
        {
          iEarnContract: '0x9Dde7cdd09dbed542fC422d18d89A589fA9fD4C0',
          name: 'Interest Bearing Ethereum',
          symbol: 'iETH',
          apr: 4,
          balance: 0.00,
          price: 0.00,
          pool_value: 0.00
        },
        {
          iEarnContract: null,
          name: 'Interest Bearing Fantom',
          symbol: 'iFTM',
          apr: 4,
          balance: 0.00,
          price: 0.00,
          pool_value: 0.00
        },
      ],
      account: {},
      web3: null,
      ethBalance: 0,
      iEthBalance: 0,
      pricePerFullShare: 0,
      yields: [],
      aggregatedYields: [],
      aggregatedHeaders: [],
      uniswapYields: [],
      uniswapLiquidity: [],
      events: []
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONNECT_METAMASK:
            this.connectMetamask(payload);
            break;
          case CONNECT_METAMASK_PASSIVE:
            this.connectMetamaskPassive(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case GET_PRICES:
            this.getPrices(payload);
            break;
          case GET_INVESTED_BALANCES:
            this.getInvestedBalances(payload);
            break;
          case GET_POOL_VALUES:
            this.getPoolValues(payload);
            break;
          case INVEST:
            this.invest(payload)
            break;
          case REDEEM:
            this.redeem(payload)
            break;
          case GET_ETH_BALANCE:
            this.getEthBalance(payload)
            break;
          case GET_IETH_BALANCE:
            this.getIEthBalance(payload)
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

            dispatcher.dispatch({ type: GET_BALANCES, content: {} })
            dispatcher.dispatch({ type: GET_INVESTED_BALANCES, content: {} })

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
            dispatcher.dispatch({ type: GET_INVESTED_BALANCES, content: {} })

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

    this._callInvest(asset, account, amount, (err, investResult) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(INVEST_RETURNED, investResult)
    })
  }

  _callInvest = async (asset, account, amount, callback) => {
    const web3 = store.getStore('web3')

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)

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
    const web3 = store.getStore('web3')

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)

    const amountSend = web3.utils.toWei(amount, "ether")

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

    async.map(assets, (asset, callback) => {
      this._getERC20Balance(asset, account, callback)
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ assets: assets })
      return emitter.emit(BALANCES_RETURNED, assets)
    })
  }

  getEthBalance = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('assets')

    let asset = assets.filter((asset) => {
      return asset.symbol == 'ETH'
    })

    if(asset.length > 0) {
      asset = asset[0]
      this._getERC20Balance(asset, account, (err, asset) => {
        store.setStore({ ethBalance: asset.balance })
        return emitter.emit(ETH_BALANCE_RETURNED, asset.balance)
      })
    } else {
      return emitter.emit(ERROR, 'Cannot find the asset')
    }
  }

  getIEthBalance = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('investedAssets')

    let asset = assets.filter((asset) => {
      return asset.symbol == 'iETH'
    })

    if(asset.length > 0) {
      asset = asset[0]
      this._getInvestedBalance(asset, account, (err, asset) => {
        store.setStore({ iEthBalance: asset.balance })
        return emitter.emit(IETH_BALANCE_RETURNED, asset.balance)
      })
    } else {
      return emitter.emit(ERROR, 'Cannot find the asset')
    }
  }

  _getERC20Balance = async (asset, account, callback) => {
    const web3 = store.getStore('web3')

    if(asset.erc20address === 'Ethereum') {
      try {
        const eth_balance = web3.utils.fromWei(await web3.eth.getBalance(account.address), "ether");

        asset.balance = parseFloat(eth_balance)

        callback(null, asset)
      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
    } else {
      let iEarnContract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)

      try {
        const balance = web3.utils.fromWei(await iEarnContract.methods.balanceOf(account.address).call({ from: account.address }), 'ether');

        asset.balance = parseFloat(balance)

        callback(null, asset)
      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
    }
  }

  getPoolValues = () => {
    const account = store.getStore('account')
    const assets = store.getStore('investedAssets')

    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));

    async.map(assets, (asset, callback) => {
      this._getPoolValue(web3, asset, account, callback)
    }, (err, valuedAssets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ investedAssets: valuedAssets })
      return emitter.emit(POOL_VALUES_RETURNED, valuedAssets)
    })
  }

  _getPoolValue = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, asset)
    }

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)

    const value = web3.utils.fromWei(await iEarnContract.methods.calcPoolValueInETH().call({ from: account.address }), 'ether');

    asset.pool_value = parseFloat(value)

    callback(null, asset)
  }

  getPrices = () => {
    const account = store.getStore('account')
    const assets = store.getStore('investedAssets')

    const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraProvider));

    async.map(assets, (asset, callback) => {
      this._getPoolPrice(web3, asset, account, callback)
    }, (err, pricedAssets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ investedAssets: pricedAssets })
      return emitter.emit(PRICES_RETURNED, pricedAssets)
    })
  }

  _getPoolPrice = async (web3, asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, asset)
    }

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)
    const balance = web3.utils.fromWei(await iEarnContract.methods.getPricePerFullShare().call({ from: account.address }), 'ether');
    store.setStore({ pricePerFullShare: balance })
    asset.price = parseFloat(balance)

    callback(null, asset)
  }

  getInvestedBalances = () => {
    const account = store.getStore('account')
    const assets = store.getStore('investedAssets')

    async.map(assets, (asset, callback) => {
      this._getInvestedBalance(asset, account, callback)
    }, (err, investedAssets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ investedAssets: investedAssets })
      return emitter.emit(INVESTED_BALANCES_RETURNED, investedAssets)
    })
  }

  _getInvestedBalance = async (asset, account, callback) => {

    if(asset.iEarnContract === null) {
      return callback(null, asset)
    }

    const web3 = store.getStore('web3')

    let iEarnContract = new web3.eth.Contract(config.IEarnABI, asset.iEarnContract)

    const balance = web3.utils.fromWei(await iEarnContract.methods.balanceOf(account.address).call({ from: account.address }), 'ether');
    const price = web3.utils.fromWei(await iEarnContract.methods.getPricePerFullShare().call({ from: account.address }), 'ether');
    store.setStore({ pricePerFullShare: price })
    asset.balance = parseFloat(balance)

    callback(null, asset)
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
