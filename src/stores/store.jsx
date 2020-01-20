import config from "../config";
import async from 'async';
import {
  ERROR,
  CONNECT_METAMASK,
  METAMASK_CONNECTED,
  GET_BALANCES,
  BALANCES_RETURNED
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
          name: 'USD Tether',
          symbol: 'USDT',
          apr: 0.6
        },
        {
          erc20address: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
          name: 'Compound USD',
          symbol: 'USDC',
          apr: 0.6
        },
        {
          erc20address: '0x0000000000085d4780B73119b644AE5ecd22b376',
          name: 'True USD',
          symbol: 'TUSD',
          apr: 0.6
        },
        {
          erc20address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
          name: 'SAI',
          symbol: 'SAI',
          apr: 0.6
        },
        {
          erc20address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
          name: 'Paxos Standard',
          symbol: 'PAX',
          apr: 0.6
        },
        {
          erc20address: 'Ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          apr: 0.6
        },
        {
          erc20address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
          name: 'Fantom',
          symbol: 'FTM',
          apr: 0.6
        },
      ],
      interestAssets: [],
      account: {},
      web3: null
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONNECT_METAMASK:
            this.connectMetamask(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
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
            return emitter.emit(ERROR, 'MetaMask is locked. Please allow access via the Metamask/Mist Extension!');
          } else {
            store.setStore({ account: { address: accounts[0] }})
            store.setStore({ web3: web3 })

            dispatcher.dispatch({ type: GET_BALANCES, content: {} })

            return emitter.emit(METAMASK_CONNECTED)
          }
        });

      } catch (error) {
        return emitter.emit(ERROR, 'Access denied. Please allow access via the Metamask/Mist Extension!');
      }
    } else {
      return emitter.emit(ERROR, 'No web3? You should consider trying MetaMask!');
    }
  }

  async getBalances() {
    const account = store.getStore('account')
    const assets = store.getStore('assets')

    async.map(assets, (asset, callback) => {
      this._getERC20Balance(asset, account, callback)
    }, (err, balances) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      return emitter.emit(BALANCES_RETURNED, balances)
    })
  }

  _getERC20Balance = async (asset, account, callback) => {
    const web3 = store.getStore('web3')

    if(asset.erc20address === 'Ethereum') {
      try {
        const eth_balance = web3.utils.fromWei(await web3.eth.getBalance(account.address), "ether");

        callback(null, {
          symbol: asset.symbol,
          balance: parseFloat(eth_balance)
        })

      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
    } else {
      let myContract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)

      try {
        const balance = web3.utils.fromWei(await myContract.methods.balanceOf(account.address).call({ from: account.address }), 'ether');

        callback(null, {
          symbol: asset.symbol,
          balance: parseFloat(balance)
        })

      } catch(ex) {
        console.log(ex)
        return callback(ex)
      }
    }
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
