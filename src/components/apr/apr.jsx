import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Card
} from '@material-ui/core';

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
    borderRadius: '20px',
    padding: '24px',
    height: 'max-content'
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
    padding: '6px 12px',
    width: '100px',
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
    width: '100px',
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
  footer: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: {
    padding: '10px',
    cursor: 'pointer'
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
  }
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
    // emitter.on(GET_YIELD_RETURNED, this.yieldReturned);
    emitter.on(GET_AGGREGATED_YIELD_RETURNED, this.aggregatedYieldReturned);

    // dispatcher.dispatch({ type: GET_YIELD, content: {  } })
    dispatcher.dispatch({ type: GET_AGGREGATED_YIELD, content: { amount: 0 } })
  }

  componentWillUnmount() {
    // emitter.removeListener(GET_YIELD_RETURNED, this.yieldReturned);
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
    const { classes } = this.props;
    const {
      amountError,
      amount,
      loading
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
                helperText="How much do you want to invest?"
                placeholder="0.00"
                variant="outlined"
                onKeyDown={ this.inputKeyDown }
              />
              <table className={ classes.tableContainer }>
                { this.renderAggregatedHeader() }
                { this.renderAggregatedYields() }
              </table>
            </Card>
          </div>
        </div>
        <div className={classes.footer}>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>about</Typography>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>docs</Typography>
          <Typography onClick={()=> window.open("https://github.com/iearn-finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>code</Typography>
          <Typography onClick={()=> window.open("https://t.me/iearnfinance", "_blank")} className={ classes.footerText } variant={ 'h6'}>telegram</Typography>
          <Typography onClick={()=> window.open("/apr", "_blank")} className={ classes.footerText } variant={ 'h6'}>yield</Typography>
          <Typography onClick={()=> window.open("/builtwith", "_blank")} className={ classes.footerText } variant={ 'h6'}>builtwith</Typography>
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
        if (y.token == 'WBTC') {
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
                if((key === '_uniswap' || key === 'unicapr') && val != 0) {
                  val = val*100 - 100
                } else {
                  val = val*100
                }

                return (<td key={ key } className={ classes.apr }>
                  <Typography align='right' color='secondary'>{ val == 0 ? '' : ((val).toFixed(4) + ' %') }</Typography>
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

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onInvest();
    }
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
      return 'Lendf';
    } else {
      return name;
    }
  }

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
      return parseFloat(b.apr) - parseFloat(a.apr)
    }).map((y) => {
      return (
        <div key={ y.token+'_y' } className={ classes.pair }>
          <div className={ classes.name }>
            <Typography align='right' variant={'h3'}>{ y.token }</Typography>
          </div>
          <div className={ classes.apr }>
            <Typography color='secondary'>{ parseFloat(y.apr).toFixed(4) + ' %' }</Typography>
          </div>
        </div>
      )
    })
  };
}

export default withRouter(withStyles(styles)(APR));
