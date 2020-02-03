import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
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
    width: '100px',
    display: 'flex',
    alignItems: 'center',
    padding: '6px'
  },
  apr: {
    flex: '1',
    padding: '6px 12px',
    width: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  headerName: {
    flex: '1',
    fontWeight: 'bold',
    padding: '6px 12px',
    width: '100px',
    paddingBottom: '6px'
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
    paddingBottom: '12px'
  },
  aggregatedHeader: {
    textAlign: 'center',
  },
  tablesContainer: {
    display: 'flex'
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
      aggregatedHeaders: store.getStore('aggregatedHeaders')
    }
  }

  componentWillMount() {
    // emitter.on(GET_YIELD_RETURNED, this.yieldReturned);
    emitter.on(GET_AGGREGATED_YIELD_RETURNED, this.aggregatedYieldReturned);

    // dispatcher.dispatch({ type: GET_YIELD, content: {  } })
    dispatcher.dispatch({ type: GET_AGGREGATED_YIELD, content: {  } })
  }

  componentWillUnmount() {
    // emitter.removeListener(GET_YIELD_RETURNED, this.yieldReturned);
    emitter.removeListener(GET_AGGREGATED_YIELD_RETURNED, this.aggregatedYieldReturned);
  };

  yieldReturned = (balances) => {
    this.setState({ yields: store.getStore('yields') })
    console.log(store.getStore('yields'))
  };

  dispatch() {
    dispatcher.dispatch({ type: GET_AGGREGATED_YIELD, content: {  } })
  }

  aggregatedYieldReturned = (balances) => {
    this.setState({ aggregatedYields: store.getStore('aggregatedYields'), aggregatedHeaders: store.getStore('aggregatedHeaders') })
    //setTimeout(this.dispatch(), 1000000);
    setTimeout(
      function() {
            this.dispatch();
        }
        .bind(this),
        3000
    );
  };

  uniswapcommparrisonReturned = (balances) => {
    this.setState({ uniswapLiquidity: store.getStore('uniswapLiquidity') })
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          <div className={ classes.pairs }>
          </div>
          <div className={ classes.tablesContainer }>
            {/*<Card className={ classes.pairs } style={{ marginRight: '12px'}}>
              { this.renderHeader() }
              { this.renderYields() }
            </Card>*/}
            <Card className={ classes.pairs }>
              { this.renderAggregatedHeader() }
              { this.renderAggregatedYields() }
            </Card>
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

  renderAggregatedHeader = () => {
    const { classes } = this.props
    const { aggregatedHeaders } = this.state

    return (
      <div className={ classes.pair }>
        <div key={ 'token' } className={ classes.headerValue }>
          <Typography variant={'h3'} className={classes.aggregatedHeader}></Typography>
        </div>
        { aggregatedHeaders.map((header) => {
          return (<div key={ header }  className={ classes.headerValue }>
            <Typography  align='right' variant={'h4'} className={classes.aggregatedHeader}>{ this.renderTableHeader(header) }</Typography>
          </div>)
        })}
      </div>
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
          <div key={ y.token } className={ classes.pair }>
            <div className={ classes.name }>
              <div className={ classes.assetIcon }>
                <img
                  alt=""
                  src={ require('../../assets/'+y.token+'-logo.png') }
                  height="30px"
                />
              </div>
              <Typography variant={'h4'} className={classes.aggregatedHeader}>{ y.token }</Typography>
            </div>
            { keys.map((key) => {

                let val = parseFloat(y.apr[key])
                if((key === 'uniapr' || key === 'unicapr') && val != 0) {
                  val = val*100 - 100
                } else {
                  val = val*100
                }

                return (<div key={ key } className={ classes.apr }>
                  <Typography align='right' color='secondary'>{ val == 0 ? '' : ((val).toFixed(4) + ' %') }</Typography>
                </div>)
              })
            }
          </div>)
      })
    )
  }

  renderTableHeader = (name) => {
    if (name === 'uniapr') {
      return 'Uni';
    } else if (name.startsWith('capr')) {
      return 'Compound';
    } else if (name.startsWith('unicapr')) {
      return 'cUni';
    } else if (name.startsWith('iapr')) {
      return 'Fulcrum';
    } else if (name.startsWith('iapr')) {
      return 'Fulcrum';
    } else if (name.startsWith('uniiapr')) {
      return 'iUni';
    } else if (name.startsWith('aapr')) {
      return 'Aave';
    } else if (name.startsWith('uniaapr')) {
      return 'aUni';
    } else if (name.startsWith('dapr')) {
      return 'dYdX';
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
