import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Tabs,
  Tab,
  Typography,
  Button,
  Card
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import UnlockModal from '../unlock/unlockModal.jsx'
import Deposit from './deposit'
import Withdraw from './withdraw'
import Exchange from './exchange'
import Store from "../../stores";

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_POOL_BALANCES
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '400px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  card: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: '20px',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#DC6BE5',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);


const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: '1px',
    '&:focus': {
      color: '#DC6BE5',
      opacity: 1,
    },
  },
}))(props => <Tab disableRipple {...props} />);


const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Pool extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      value: 1,
      loading: false,
      account: account
    }

  }

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  };

  connectionConnected = () => {

    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
  }

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  render() {
    const { classes, t } = this.props;
    const {
      value,
      account,
      loading,
      modalOpen,
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        { !account.address &&
          <div className={ classes.investedContainer }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.introCenter }>
              <Typography variant='h3'>{ t('Pool.Intro') }</Typography>
            </div>
            <div className={ classes.connectContainer }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.overlayClicked }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>{ t('Pool.Connect') }</Typography>
              </Button>
            </div>
          </div>
        }
        { account.address &&
          <div className={ classes.card }>
            <StyledTabs value={value} onChange={this.handleTabChange} >
              <StyledTab label="Deposit" />
              <StyledTab label="Exchange" />
              <StyledTab label="Withdraw" />
            </StyledTabs>
          </div>
        }
        { account.address && value == 0 && <Deposit /> }
        { account.address && value == 1 && <Exchange /> }
        { account.address && value == 2 && <Withdraw /> }
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  handleTabChange = (event, newValue) => {
    this.setState({value:newValue})
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(Pool)));
