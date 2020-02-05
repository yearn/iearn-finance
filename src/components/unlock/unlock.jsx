import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button
} from '@material-ui/core';

import Web3 from 'web3'
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
} from "../../stores/connectors";
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError
} from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import {
  URI_AVAILABLE,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { useEagerConnect, useInactiveListener } from "./hooks";

import {
  ERROR,
  CONNECT_METAMASK,
  METAMASK_CONNECTED,
  CONNECT_LEDGER,
  LEDGER_CONNECTED
} from '../../constants'

import Store from "../../stores";
const dispatcher = Store.dispatcher
const emitter = Store.emitter
const store = Store.store



const styles = theme => ({
  root: {
    flex: 1,
    height: 'auto',
    display: 'flex'
  },
  contentContainer: {
    margin: 'auto',
    maxWidth: '900px',
    textAlign: 'center',
    padding: '24px'
  },
  cardContainer: {
    marginTop: '60px',
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  unlockCard: {
    padding: '24px'
  },
  metamaskIcon: {
    backgroundImage: 'url('+require('../../assets/icn-metamask.svg')+')',
    width: '30px',
    height: '30px'
  },
  ledgerIcon: {
    backgroundImage: 'url('+require('../../assets/icn-ledger.svg')+')',
    width: '30px',
    height: '30px'
  },
  buttonText: {
    marginLeft: '12px',
    fontWeight: '700',
  },
  instruction: {
    maxWidth: '400px',
    marginBottom: '32px',
    marginTop: '32px'
  },
  metamask: {
    backgroundImage: 'url('+require('../../assets/metamask.svg')+')',
    width: '200px',
    height: '200px'
  },
  ledger: {
    backgroundImage: 'url('+require('../../assets/icn-ledger.svg')+')',
    backgroundSize: '100%',
    width: '200px',
    height: '200px'
  },
  actionButton: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '3rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
});

class Unlock extends Component {

  constructor(props) {
    super()

    this.state = {
      error: null,
      metamaskLoading: false,
      ledgerLoading: false
    }
  }

  componentWillMount() {
    emitter.on(METAMASK_CONNECTED, this.metamaskUnlocked);
    emitter.on(LEDGER_CONNECTED, this.ledgerUnlocked);
    emitter.on(ERROR, this.error);
  };

  componentWillUnmount() {
    emitter.removeListener(METAMASK_CONNECTED, this.metamaskUnlocked);
    emitter.removeListener(LEDGER_CONNECTED, this.ledgerUnlocked);
    emitter.removeListener(ERROR, this.error);
  };

  navigateInvest = () => {
    this.props.history.push('/invest')
  }

  unlockMetamask = () => {
    this.setState({ metamaskLoading: true })
    dispatcher.dispatch({ type: CONNECT_METAMASK, content: {} })
  }

  unlockLedger = () => {
    this.setState({ ledgerLoading: true })
    dispatcher.dispatch({ type: CONNECT_LEDGER, content: {} })
  }

  error = (err) => {
    this.setState({ loading: false, error: err, metamaskLoading: false, ledgerLoading: false })
  };

  metamaskUnlocked = () => {
    this.setState({ metamaskLoading: false })
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
  }

  ledgerUnlocked = () => {
    this.setState({ ledgerLoading: false })
    if(this.props.closeModal != null) {
      this.props.closeModal()
    }
  }

  cancelLedger = () => {
    this.setState({ ledgerLoading: false })
  }

  cancelMetamask = () => {
    this.setState({ metamaskLoading: false })
  }

  render() {
    const { classes, closeModal } = this.props;
    const { metamaskLoading, ledgerLoading } = this.state;

    return (
      <div className={ classes.root }>
        <div className={ classes.contentContainer }>
          <Typography variant={ 'h3'}>Connect your wallet to use iearn finance</Typography>
          { /* metamaskLoading && this.renderMetamaskLoading() */ }
          { /* ledgerLoading && this.renderLedgerLoading() */ }
          { /* (!metamaskLoading && !ledgerLoading) && this.renderOptions() */ }
          { /* (!metamaskLoading && !ledgerLoading && closeModal != null) && <Button className={ classes.actionButton } variant='outlined' color='secondary' onClick={ closeModal } fullWidth>
            <Typography className={ classes.buttonText } variant={ 'h5'}>Close</Typography>
          </Button> */ }


          <Web3ReactProvider getLibrary={getLibrary}>
            <MyComponent closeModal={ closeModal} />
          </Web3ReactProvider>
        </div>
      </div>
    )
  };

  renderMetamaskLoading = () => {
    const { classes } = this.props;

    return (<div className={ classes.cardContainer }>
      <div className={ classes.metamask }>
      </div>
      <Typography variant={ 'h3'} className={ classes.instruction }>
        Click connect in the MetaMask notification window to connect your wallet to iearn finance.
      </Typography>
      <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.cancelMetamask } fullWidth>
        <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Cancel</Typography>
      </Button>
    </div>)
  };

  renderLedgerLoading = () => {
    const { classes } = this.props;

    return (<div className={ classes.cardContainer }>
      <div className={ classes.ledger }>
      </div>
      <Typography variant={ 'h3'} className={ classes.instruction }>
        Insert yout ledger device and authorize iEarn.
      </Typography>
      <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.cancelLedger } fullWidth>
        <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Cancel</Typography>
      </Button>
    </div>)
  }

  renderOptions = () => {
    const { classes, closeModal } = this.props;
    const connectorsByName = store.getStore('connectorsByName')

    return Object.keys(connectorsByName).map((name) => {
      return (<Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ () => { this.unlockConnector(name) } } fullWidth>
        <div className={ classes.metamaskIcon }></div>
        <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Unlock using {name}</Typography>
      </Button>)
    })

    // return (
    //   <div className={ classes.cardContainer }>
    //     <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.unlockMetamask } fullWidth>
    //       <div className={ classes.metamaskIcon }></div>
    //       <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Unlock using Metamask</Typography>
    //     </Button>
    //     <Button className={ classes.actionButton } variant='outlined' color='primary' onClick={ this.unlockLedger } fullWidth>
    //       <div className={ classes.ledgerIcon }></div>
    //       <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Unlock using Ledger</Typography>
    //     </Button>
    //     { closeModal != null && <Button className={ classes.actionButton } variant='outlined' color='secondary' onClick={ closeModal } fullWidth>
    //       <Typography className={ classes.buttonText } variant={ 'h5'}>Close</Typography>
    //     </Button> }
    //   </div>
    // )
  };
}


const connectorsByName = {
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
};

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

function onConnectionClicked(currentConnector, name, setActivatingConnector, activate) {
  setActivatingConnector(currentConnector);
  activate(connectorsByName[name]);
}

function MyComponent(props) {
  const context = useWeb3React();

  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;

  const { closeModal } = props

  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  React.useEffect(() => {
    if (account && active && library) {
      console.log("we are active: "+account)
      store.setStore({ account: { address: account }, library: library})

      if(closeModal) {
        closeModal()
        emitter.emit(METAMASK_CONNECTED)
      }
    }
  }, [account, active, closeModal]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "20rem",
          margin: "auto"
        }}
      >
        {Object.keys(connectorsByName).map(name => {
          const currentConnector = connectorsByName[name];
          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          const disabled =
            !triedEager || !!activatingConnector || connected || !!error;

          return (
            <button
              style={{
                height: "3rem",
                borderRadius: "1rem",
                borderColor: activating
                  ? "orange"
                  : connected
                  ? "green"
                  : "unset",
                cursor: disabled ? "unset" : "pointer",
                position: "relative"
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                onConnectionClicked(currentConnector, name, setActivatingConnector, activate)
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  color: "black",
                  margin: "0 0 0 1rem"
                }}
              >
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {(active || error) && (
          <button
            style={{
              height: "3rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              borderColor: "red",
              cursor: "pointer"
            }}
            onClick={() => {
              deactivate();
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && (
          <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>

      <hr style={{ margin: "2rem" }} />

      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "fit-content",
          maxWidth: "20rem",
          margin: "auto"
        }}
      >
        {!!(connector === network && chainId) && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer"
            }}
            onClick={() => {
              connector.changeChainId(chainId === 1 ? 4 : 1);
            }}
          >
            Switch Networks
          </button>
        )}
        {connector === walletconnect && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer"
            }}
            onClick={() => {
              connector.close();
            }}
          >
            Kill WalletConnect Session
          </button>
        )}
        {connector === fortmatic && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer"
            }}
            onClick={() => {
              connector.close();
            }}
          >
            Kill Fortmatic Session
          </button>
        )}
        {connector === portis && (
          <>
            {chainId !== undefined && (
              <button
                style={{
                  height: "3rem",
                  borderRadius: "1rem",
                  cursor: "pointer"
                }}
                onClick={() => {
                  connector.changeNetwork(chainId === 1 ? 100 : 1);
                }}
              >
                Switch Networks
              </button>
            )}
            <button
              style={{
                height: "3rem",
                borderRadius: "1rem",
                cursor: "pointer"
              }}
              onClick={() => {
                connector.close();
              }}
            >
              Kill Portis Session
            </button>
          </>
        )}
        {connector === torus && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer"
            }}
            onClick={() => {
              connector.close();
            }}
          >
            Kill Torus Session
          </button>
        )}
      </div>
    </div>
  )

}



export default withRouter(withStyles(styles)(Unlock));
