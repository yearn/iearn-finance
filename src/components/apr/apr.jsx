import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';

import {
  GET_YIELD,
  GET_YIELD_RETURNED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'center',
    marginTop: '60px',
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
      marginTop: '0px',
    }
  },
  investedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  intro: {
    padding: '12px',
    textAlign: 'center',
    maxWidth: '500px'
  },
  pairs: {

  },
  pair: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  name: {
    flex: '1',
    paddingRight: '12px',
    width: '200px'
  },
  apr: {
    flex: '1',
    paddingLeft: '12px',
    width: '200px'
  },
  headerName: {
    flex: '1',
    fontWeight: 'bold',
    paddingRight: '12px',
    width: '200px',
    paddingBottom: '6px'
  },
  headerApr: {
    fontWeight: 'bold',
    flex: '1',
    paddingLeft: '12px',
    width: '200px',
    paddingBottom: '6px'
  },
  footer: {
    position: 'fixed',
    bottom: '30px',
    left: '30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: {
    padding: '10px',
    cursor: 'pointer'
  }
});

class APR extends Component {

  constructor() {
    super()

    this.state = {
      yields: store.getStore('yields'),
    }
  }

  componentWillMount() {
    emitter.on(GET_YIELD_RETURNED, this.yieldReturned);

    dispatcher.dispatch({ type: GET_YIELD, content: {  } })
  }

  componentWillUnmount() {
    emitter.removeListener(GET_YIELD_RETURNED, this.yieldReturned);
  };

  yieldReturned = (balances) => {
    this.setState({ yields: store.getStore('yields') })
  };

  render() {
    const { classes } = this.props;
    const {
      snackbarMessage
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          <div className={ classes.pairs }>
            { this.renderHeader() }
          </div>
          <div className={ classes.pairs }>
            { this.renderYields() }
          </div>
        </div>
        <div className={classes.footer}>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>about</Typography>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>docs</Typography>
          <Typography onClick={()=> window.open("https://github.com/iearn-finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>code</Typography>
          <Typography onClick={()=> window.open("https://t.me/iearnfinance", "_blank")} className={ classes.footerText } variant={ 'h6'}>telegram</Typography>
          <Typography onClick={()=> window.open("/apr", "_blank")} className={ classes.footerText } variant={ 'h6'}>yield</Typography>
        </div>
      </div>
    )
  };

  renderHeader = () => {
    const { classes } = this.props

    return (
      <div key={ 'name' } className={ classes.pair }>
        <div className={ classes.headerName }>
          <Typography align='right' variant={'h3'}>name</Typography>
        </div>
        <div className={ classes.headerApr }>
          <Typography variant={'h3'}>yield</Typography>
        </div>
      </div>
    )
  };

  mapNames = (name) => {
    if (name.startsWith('A')) {
      return 'Aave '+name;
    } else if (name.startsWith('I')) {
      return 'Fulcrum '+name;
    } else if (name.startsWith('C')) {
      return 'Compound '+name;
    } else {
      return name;
    }
  }

  renderYields = () => {
    const { classes } = this.props
    const { yields } = this.state

    return yields.sort((a, b) => {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return b[keysB[0]] - a[keysA[0]]
      }).map((y) => {
      const keys = Object.keys(y)
      return (
        <div key={ y.name } className={ classes.pair }>
          <div className={ classes.name }>
            <Typography color='secondary' align='right'>{ this.mapNames(keys[0]) }</Typography>
          </div>
          <div className={ classes.apr }>
            <Typography color='secondary'>{ (y[keys[0]]*100).toFixed(4) + ' %' }</Typography>
          </div>
        </div>
      )
    })
  };
}

export default withRouter(withStyles(styles)(APR));
