import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card
} from '@material-ui/core';

// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from 'recharts'

import {
  GET_CONTRACT_EVENTS,
  GET_CONTRACT_EVENTS_RETURNED
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
    padding: '24px',
    height: 'max-content'
  },
  pair: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  name: {
    flex: '1',
    padding: '6px 12px',
    width: '130px'
  },
  apr: {
    flex: '1',
    padding: '6px 12px',
    width: '130px'
  },
  headerName: {
    flex: '1',
    fontWeight: 'bold',
    padding: '6px 12px',
    width: '130px',
    paddingBottom: '6px'
  },
  headerApr: {
    fontWeight: 'bold',
    flex: '1',
    padding: '6px 12px',
    width: '130px',
    paddingBottom: '6px'
  },
  headerValue: {
    fontWeight: 'bold',
    flex: '1',
    width: '130px',
    padding: '6px 12px',
    paddingBottom: '12px'
  },
  tablesContainer: {
    display: 'flex'
  }
});

class Performance extends Component {

  constructor() {
    super()

    this.state = {
      events: store.getStore('events'),
    }
  }

  componentWillMount() {
    emitter.on(GET_CONTRACT_EVENTS_RETURNED, this.contractEventsReturned);

    dispatcher.dispatch({ type: GET_CONTRACT_EVENTS, content: {  } })
  }

  componentWillUnmount() {
    emitter.removeListener(GET_CONTRACT_EVENTS_RETURNED, this.contractEventsReturned);
  };

  contractEventsReturned = (balances) => {
    this.setState({ events: store.getStore('events') })
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          <div className={ classes.intro }>
            <Typography variant='h3'>ROI</Typography>
          </div>
          <div className={ classes.tablesContainer }>
            <Card className={ classes.pairs } style={{ marginRight: '24px' }}>
              { this.renderHeader() }
              { this.renderValues() }
            </Card>
            <Card className={ classes.pairs }>
              { this.renderGraph() }
            </Card>
          </div>
        </div>
      </div>
    )
  };

  renderGraph() {
    // const { events } = this.state

    return null
    // return (
    //   <LineChart width={600} height={400} data={events}
    //     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis dataKey="blockNumber" />
    //     <YAxis />
    //     <Tooltip />
    //     <Legend />
    //     {/*<Line type="monotone" dataKey="growth" stroke="#8884d8" />*/}
    //     <Line type="linear" dataKey="ethRatio" stroke="#82ca9d" />
    //   </LineChart>
    // )
  }

  renderHeader = () => {
    const { classes } = this.props

    return (
      <div key={ 'name' } className={ classes.pair }>
        <div className={ classes.headerName }>
          <Typography align='left' variant={'h3'}>Block</Typography>
        </div>
        <div className={ classes.headerApr }>
          <Typography variant={'h3'} align='right'>ETH</Typography>
        </div>
        <div className={ classes.headerApr }>
          <Typography variant={'h3'} align='right'>iETH</Typography>
        </div>
        <div className={ classes.headerApr }>
          <Typography variant={'h3'} align='right'>ETH Redeem</Typography>
        </div>
        <div className={ classes.headerApr }>
          <Typography variant={'h3'} align='right'>Growth %</Typography>
        </div>
        <div className={ classes.headerApr }>
          <Typography variant={'h3'} align='right'>iETH:ETH</Typography>
        </div>
      </div>
    )
  }

  renderValues = () => {
    const { classes } = this.props
    const { events } = this.state

    return events.map((e) => {
      return (
        <div key={ e.blockNumber+'_y' } className={ classes.pair }>
          <div className={ classes.apr }>
            <Typography variant={'h3'} align='left' color='secondary'>{ e.blockNumber }</Typography>
          </div>
          <div className={ classes.apr }>
            <Typography align='right' color='secondary'>{ parseFloat(e.eth).toFixed(4) + '' }</Typography>
          </div>
          <div className={ classes.apr }>
            <Typography align='right' color='secondary'>{ parseFloat(e.iEth).toFixed(4) + '' }</Typography>
          </div>
          <div className={ classes.apr }>
            <Typography align='right' color='secondary'>{ parseFloat(e.ethRedeem).toFixed(4) + '' }</Typography>
          </div>
          <div className={ classes.apr }>
            <Typography align='right' color='secondary'>{ parseFloat(e.growth).toFixed(4) + ' %' }</Typography>
          </div>
          <div className={ classes.apr }>
            <Typography align='right' color='secondary'>{ parseFloat(e.ethRatio).toFixed(4) + ' %' }</Typography>
          </div>
        </div>
      )
    })
  }
}

export default withRouter(withStyles(styles)(Performance));
