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
          <div className={ classes.intro }>
            <Typography variant='h2'>APR. Simple.</Typography>
          </div>
          <div className={ classes.pairs }>
            { this.renderHeader() }
          </div>
          <div className={ classes.pairs }>
            { this.renderYields() }
          </div>
        </div>
      </div>
    )
  };

  renderHeader = () => {
    const { classes } = this.props

    return (
      <div key={ 'name' } className={ classes.pair }>
        <div className={ classes.headerName }>
          <Typography align='right' variant={'h3'}>Name</Typography>
        </div>
        <div className={ classes.headerApr }>
          <Typography variant={'h3'}>Yield</Typography>
        </div>
      </div>
    )
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
            <Typography align='right'>{ keys[0] }</Typography>
          </div>
          <div className={ classes.apr }>
            <Typography>{ (y[keys[0]]*100).toFixed(4) + ' %' }</Typography>
          </div>
        </div>
      )
    })
  }
}

export default withRouter(withStyles(styles)(APR));
