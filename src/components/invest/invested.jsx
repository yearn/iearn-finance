import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  TextField,
  Button
} from '@material-ui/core';

import {
  INVESTED_BALANCES_RETURNED,
  REDEEM,
  REDEEM_RETURNED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    padding: '60px 0px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  inputCard: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  inputCardHeading: {
    padding: '24px',
    flex: 1
  },
  inputCardValues: {
    width: '200px'
  },
  inputCardBalance: {
    paddingTop: '24px',
    paddingRight: '24px'
  },
  inputCardSubtitle: {
    paddingBottom: '24px',
    paddingRight: '24px'
  },
  assetsCard: {
    width: '100%',
    marginTop: '60px'
  },
  assetCardHeading: {
    padding: '24px',
    borderBottom: '1px solid #aaa'
  },

  tableRoot: {
    display: 'flex',
    flexDirection: 'column'
  },
  tableHeaderRow: {
    width: '100%',
    display: 'flex',
    borderBottom: '1px solid #aaa'
  },
  tableHeaderCell: {
    padding: '6px',
    width: '100px'
  },
  tableHeaderCell1: {
    width: 'auto',
    paddingLeft: '24px',
    flex: 1
  },
  tableHeaderCellLast: {
    paddingRight: '24px',
    width: '180px'
  },
  tableHeaderCellText: {
    fontWeight: 'bold'
  },
  tableRow: {
    width: '100%',
    display: 'flex',
    borderBottom: '1px solid #aaa',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#ccc'
    }
  },
  tableCell: {
    padding: '12px 6px',
    width: '100px',
    cursor: 'pointer'
  },
  tableCell1: {
    width: 'auto',
    paddingLeft: '24px',
    flex: 1
  },
  tableCellLast: {
    paddingRight: '24px',
    width: '180px'
  },
  tableRowExpanded: {
    width: '100%',
    display: 'flex',
    borderBottom: '1px solid #aaa',
    flexWrap: 'wrap'
  },
  action: {
    width: '100%',
    padding: '12px 24px',
    display: 'flex'
  },
  actionInputContainer: {
    flex: 1,
    marginRight: '12px'
  },
  actionInput: {
  },
  actionButton: {
    padding: '15px'
  },
  buttonText: {
  }
});

class Invested extends Component {

  constructor() {
    super()

    this.state = {
      expandAsset: null,
      assets: store.getStore('investedAssets')
    }
  }

  componentWillMount() {
    emitter.on(INVESTED_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
  };

  componentWillUnmount() {
    emitter.removeListener(INVESTED_BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
  };

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('investedAssets') })
  };

  redeemReturned = (txHash) => {
    console.log(txHash)
    //something, probably show snackbar
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        <Card className={ classes.inputCard }>
          <Typography variant='h3' className={ classes.inputCardHeading }>Investments</Typography>
          <div className={ classes.inputCardValues }>
            <Typography variant='h4' className={ classes.inputCardBalance } align='right'>$18.43</Typography>
            <Typography variant='h5' className={ classes.inputCardSubtitle } align='right'>Interest Earned</Typography>
          </div>
        </Card>
        <Card className={ classes.assetsCard }>
          <Typography variant='h3' className={ classes.assetCardHeading }>I am earning interest on</Typography>
          {this.renderAssetTable()}
        </Card>
      </div>
    )
  };

  renderAssetTable = () => {
    const { classes } = this.props;
    const {
      expandAsset,
      amount,
      amountError,
      loading,
      assets
    } = this.state;

    return (
      <div className={ classes.tableRoot }>
        <div className={ classes.tableHeaderRow }>
          <div className={ `${classes.tableHeaderCell} ${classes.tableHeaderCell1}` }>
            <Typography variant='body2' className={ classes.tableHeaderCellText }>Asset</Typography>
          </div>
          <div className={ classes.tableHeaderCell }>
            <Typography variant='body2' className={ classes.tableHeaderCellText } align='right'>APR</Typography>
          </div>
          <div className={ `${classes.tableHeaderCell} ${classes.tableHeaderCellLast}` }>
            <Typography variant='body2' className={ classes.tableHeaderCellText } align='right'>Balance</Typography>
          </div>
        </div>
        { assets.map((asset) => {

          console.log(asset.balance)

          if(expandAsset && expandAsset.symbol === asset.symbol) {
            return (
              <div key={asset.symbol} className={ classes.tableRowExpanded } >
                <div className={ `${classes.tableCell} ${classes.tableCell1}` } onClick={ (e) => { this.clickRow(e, asset) } }>
                  <Typography variant='body1' noWrap>{ asset.name }</Typography>
                </div>
                <div className={ classes.tableCell } onClick={ (e) => { this.clickRow(e, asset) } }>
                  <Typography variant='body1' align='right' noWrap>{ asset.apr }%</Typography>
                </div>
                <div className={ `${classes.tableCell} ${classes.tableCellLast}` } onClick={ (e) => { this.clickRow(e, asset) } }>
                  <Typography variant='body1' align='right' noWrap>{ asset.balance ? asset.balance.toFixed(4) : '0.00' } { asset.symbol }</Typography>
                </div>
                <div className={ classes.action }>
                  <div className={ classes.actionInputContainer }>
                    <TextField
                      fullWidth
                      className={ classes.actionInput }
                      id='amount'
                      value={ amount }
                      error={ amountError }
                      onChange={ this.onChange }
                      disabled={ loading }
                      label="Amount"
                      placeholder="0.00"
                      variant="outlined"
                    />
                  </div>
                  <Button
                    className={ classes.actionButton }
                    variant="contained"
                    color="secondary"
                    disabled={ loading }
                    onClick={ this.onCollateralize }
                    >
                    <Typography className={ classes.buttonText } variant={ 'h3'}>Redeem</Typography>
                  </Button>
                </div>
              </div>
            )
          }

          return (
            <div key={asset.symbol} className={ classes.tableRow } onClick={ (e) => { this.clickRow(e, asset) } }>
              <div className={ `${classes.tableCell} ${classes.tableCell1}` }>
                <Typography variant='body1' noWrap>{ asset.name }</Typography>
              </div>
              <div className={ classes.tableCell }>
                <Typography variant='body1' align='right' noWrap>{ asset.apr }%</Typography>
              </div>
              <div className={ `${classes.tableCell} ${classes.tableCellLast}` }>
                <Typography variant='body1' align='right' noWrap>{ asset.balance ? asset.balance.toFixed(4) : '0.00' } { asset.symbol }</Typography>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  clickRow = (event, asset) => {

    if(!this.state.expandAsset) {
      this.setState({ expandAsset: asset })
    } else if(this.state.expandAsset.symbol === asset.symbol) {
      this.setState({ expandAsset: null })
    } else {
      this.setState({ expandAsset: asset })
    }

  }

  collapseRow = () => {
    this.setState({ expandAsset: null })
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }
}

export default withRouter(withStyles(styles)(Invested));
