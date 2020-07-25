import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Card,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import {
  GET_AGGREGATED_YIELD,
  GET_AGGREGATED_YIELD_RETURNED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1000px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '60px',
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
      marginTop: '0px',
    }
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  investedContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  intro: {
    padding: '36px',
    textAlign: 'center',
    width: '100%',
  },
  pairs: {
    padding: '42px 36px',
    borderRadius: '50px',
    border: '1px solid ' + colors.borderBlue,
    marginTop: '40px',
  },
  pair: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  name: {
    width: '60px',
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    position: 'absolute',
    top: 'auto',
    background: '#fff',
    [theme.breakpoints.up('md')]: {
      width: '100px',
    }
  },
  apr: {
    flex: '1',
    padding: '6px 25px',
    width: '133px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '42px',
    '&:nth-child(2)': {
      marginLeft: '60px'
    },
    [theme.breakpoints.up('md')]: {
      '&:nth-child(2)': {
        marginLeft: '100px'
      }
    }
  },
  headerName: {
    flex: '1',
    fontWeight: 'bold',
    padding: '6px 12px',
    width: '60px',
    paddingBottom: '6px',
    [theme.breakpoints.up('md')]: {
      width: '100px',
    }
  },
  headerApr: {
    fontWeight: 'bold',
    flex: '1',
    padding: '6px 12px',
    width: '100px',
    paddingBottom: '6px'
  },
  headerValue: {
    fontWeight: 'bold',
    flex: '1',
    width: '135px',
    padding: '6px 12px',
    paddingBottom: '12px',
    '&:nth-child(2)': {
      marginLeft: '60px'
    },
    [theme.breakpoints.up('md')]: {
      '&:nth-child(2)': {
        marginLeft: '100px'
      }
    }
  },
  headerValueName: {
    fontWeight: 'bold',
    width: '60px',
    padding: '6px 12px',
    paddingBottom: '12px',
    position: 'absolute',
    top: 'auto',
    background: '#fff',
    height: '42px',
    [theme.breakpoints.up('md')]: {
      width: '100px',
    }
  },
  aggregatedHeader: {
    textAlign: 'center',
  },
  aggregatedHeaderVal: {
    textAlign: 'center',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    }
  },
  tablesContainer: {
    display: 'flex'
  },
  tableContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 'calc(100vw - 68px)',
    overflowX: 'auto'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '12px'
  },
});

class APR extends Component {

  constructor() {
    super()

    this.state = {
      yields: store.getStore('yields'),
      uniswapYields: store.getStore('uniswapYields'),
      uniswapYieldsV2: store.getStore('uniswapYieldsV2'),
      aggregatedYields: store.getStore('aggregatedYields'),
      aggregatedHeaders: store.getStore('aggregatedHeaders'),
      amount: '',
      amountError: false,
      loading: false
    }
  }

  componentWillMount() {
    emitter.on(GET_AGGREGATED_YIELD_RETURNED, this.aggregatedYieldReturned);

    dispatcher.dispatch({ type: GET_AGGREGATED_YIELD, content: { amount: 0 } })
  }

  componentWillUnmount() {
    emitter.removeListener(GET_AGGREGATED_YIELD_RETURNED, this.aggregatedYieldReturned);
  };

  yieldReturned = (balances) => {
    this.setState({ yields: store.getStore('yields') })
    console.log(store.getStore('yields'))
  };

  dispatch(val) {
    dispatcher.dispatch({ type: GET_AGGREGATED_YIELD, content: { amount: val } })
  }

  aggregatedYieldReturned = (balances) => {
    this.setState({ aggregatedYields: store.getStore('aggregatedYields'), aggregatedHeaders: store.getStore('aggregatedHeaders') })
  };

  uniswapcommparrisonReturned = (balances) => {
    this.setState({ uniswapLiquidity: store.getStore('uniswapLiquidity') })
  };

  render() {
    const { classes, t } = this.props;
    const {
      amountError,
      amount,
      loading,
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.tablesContainer }>
          <div className={ classes.investedContainer }>
            <Card className={ classes.pairs }>
              <TextField
                fullWidth
                className={ classes.actionInput }
                id='amount'
                value={ amount }
                error={ amountError }
                onChange={ this.onChange }
                disabled={ loading }
                label=""
                size="small"
                helperText={ t("APR.HowMuch")}
                placeholder="0.00"
                variant="outlined"
              />
              <table className={ classes.tableContainer }>
                { this.renderAggregatedHeader() }
                { this.renderAggregatedYields() }
              </table>
            </Card>
          </div>
        </div>
      </div>
    )
  };

  renderAggregatedHeader = () => {
    const { classes } = this.props
    const { aggregatedHeaders } = this.state

    return (
      <tr className={ classes.pair }>
        <th key={ 'token' } className={ classes.headerValueName }>
          <Typography variant={'h3'} className={classes.aggregatedHeader}></Typography>
        </th>
        { aggregatedHeaders.map((header) => {
          return (<th key={ header }  className={ classes.headerValue }>
            <Typography  align='right' variant={'h4'} className={classes.aggregatedHeader}>{ this.renderTableHeader(header) }</Typography>
          </th>)
        })}
      </tr>
    )
  }

  renderAggregatedYields = () => {
    const { classes } = this.props
    const { aggregatedYields } = this.state

    return (
      aggregatedYields.map((y) => {

        const keys = Object.keys(y.apr)
        if (y.token === 'WBTC') {
          y.token = 'wBTC';
        }

        return (
          <tr key={ y.token } className={ classes.pair }>
            <td className={ classes.name }>
              <div className={ classes.assetIcon }>
                <img
                  alt=""
                  src={ require('../../assets/'+y.token+'-logo.png') }
                  height="30px"
                />
              </div>
              <Typography variant={'h4'} className={classes.aggregatedHeaderVal}>{ y.token }</Typography>
            </td>
            { keys.map((key) => {

                let val = parseFloat(y.apr[key])
                if((key === '_uniswap' || key === 'unicapr') && val !== 0) {
                  val = val*100 - 100
                } else {
                  val = val*100
                }

                return (<td key={ key } className={ classes.apr }>
                  <Typography align='right' color='secondary'>{ val === 0 ? '' : ((val).toFixed(4) + ' %') }</Typography>
                </td>)
              })
            }
          </tr>)
      })
    )
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
    setTimeout(this.dispatch(event.target.value));
  }

  renderTableHeader = (name) => {
    if (name === '_uniswap') {
      return 'Uniswap (APY)';
    } else if (name.startsWith('_compound')) {
      return 'Compound';
    } else if (name.startsWith('_fulcrum')) {
      return 'Fulcrum';
    } else if (name.startsWith('_aave')) {
      return 'Aave';
    } else if (name.startsWith('_dydx')) {
      return 'dYdX';
    } else if (name.startsWith('_ddex')) {
      return 'ddex';
    } else if (name.startsWith('_lendf')) {
      return 'dForce';
    } else {
      return name;
    }
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(APR)));
