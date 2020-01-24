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

    asset.balance = parseFloat(balance)

    callback(null, asset)
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
