import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import BigNumber from 'bignumber.js'
import ReactImageFallback from "react-image-fallback";

import {
  ERROR,
  LENDING_BORROW,
  LENDING_BORROW_RETURNED,
  LENDING_REPAY,
  LENDING_REPAY_RETURNED
} from '../../constants'

import { colors } from '../../theme'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher

const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  accordion: {
    cursor: 'pointer',
    border: 'none',
    margin: '0px',
    borderRadius: '0px',
    borderBottom: '1px solid #dedede',
    "&:last-child": {
      borderBottom: 'none'
    }
  },
  accordionSummary: {
    padding: '0px 0px',
    width: '100%',
  },
  actionsContainer: {
    display: 'flex',
    flex: '1',
    padding: '24px 12px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    height: '47px'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    margin: '24px',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
      borderBottom: 'none',
      margin: '0px'
    }
  },
  heading: {
    flex: 2,
  },
  headingCollateral: {
    width: '80px',
  },
  headingAPY: {
    flex: 1
  },
  headingName: {
    flex: 2,
    display: 'flex',
    alignItems: 'center'
  },
  buttons: {
    display: 'flex',
    width: '100%'
  },
  disabledContainer: {
    width: '100%',
    paddingTop: '12px',
    textAlign: 'center'
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '12px',
    width: '100%',
    flexWrap: 'wrap'
  },
  grey: {
    color: colors.darkGray
  },
  assetIcon: {
    marginRight: '12px',
    width: '30px',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
    }
  },
  assetInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '12px',
    width: '100%',
    flexWrap: 'wrap'
  },
  infoField: {
    flex: 1,
    padding: '12px 0px',
  },
  assetActions: {
    width: '100%',
    background: '#dedede',
  },
  removePadding: {
    padding: '0px'
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  emptyScale: {
    height: '36px'
  },
  scale: {
    minWidth: '10px',
    padding: '10px'
  },
  fullWidth: {
    minWidth: 'calc(100% - 24px)',
    margin: '0px 12px',
    borderBottom: '1px solid '+colors.borderBlue
  },
  assetSummarySectionheader: {
    width: '150px'
  },
  flexy: {
    padding: '6px 0px'
  }
});


class BorrowAsset extends Component {

  constructor() {
    super()

    this.state = {
      borrowAmount: '',
      borrowAmountError: false,
      repayAmount: '',
      repayAmountError: false,
      actionsOpen: false,
    }
  }

  componentWillMount() {
    emitter.on(LENDING_BORROW_RETURNED, this.borrowReturned);
    emitter.on(LENDING_REPAY_RETURNED, this.repayReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(LENDING_BORROW_RETURNED, this.borrowReturned);
    emitter.removeListener(LENDING_REPAY_RETURNED, this.repayReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  borrowReturned = () => {
    this.setState({ loading: false, borrowAmount: '' })
  };

  repayReturned = (txHash) => {
    this.setState({ loading: false, repayAmount: '' })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, asset } = this.props;
    const {
      expanded
    } = this.state

    return (
      <Accordion TransitionProps={{ unmountOnExit: true }} className={ classes.accordion } square key={ asset.symbol+"_expand" } expanded={ expanded === asset.symbol} onChange={ () => { this.handleChange(asset.symbol) } }>
        <AccordionSummary
          className={ classes.accordionSummary }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div className={ classes.assetSummary }>
            <div className={ classes.headingName }>
              <ReactImageFallback
                src={ this.getLogo(asset.erc20address) }
                fallbackImage={ require('../../assets/unknown-logo.png') }
                alt=""
                className={ classes.assetIcon } />
              <Typography variant={ 'h4' } className={ classes.assetName } noWrap>{ asset.symbol }</Typography>
            </div>
            <div className={classes.headingAPY }>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.borrowAPY ? BigNumber(asset.borrowAPY).toFixed(2, BigNumber.ROUND_DOWN) : '0.00' }%</Typography>
            </div>
            <div className={classes.heading}>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.balance ? BigNumber(asset.balance).toFixed(2, BigNumber.ROUND_DOWN) : '0.00' } { asset.symbol }</Typography>
            </div>
            <div className={classes.heading}>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.borrowBalance ? BigNumber(asset.borrowBalance).toFixed(2, BigNumber.ROUND_DOWN) : '0.00' } { asset.symbol }</Typography>
            </div>
            <div className={classes.heading}>
              <Typography variant={ 'h4' } noWrap align='right'>{ asset.liquidity ? BigNumber(asset.liquidity).toFixed(2, BigNumber.ROUND_DOWN) : '0.00' } { asset.symbol }</Typography>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className={ classes.removePadding }>
          { this._renderActions() }
        </AccordionDetails>
      </Accordion>
    )
  };

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  _renderActions = () => {
    const { classes, asset, limit, limitUsed } = this.props;
    const {
      borrowAmount,
      borrowAmountError,
      repayAmount,
      repayAmountError,
      loading
    } = this.state

    let theLimitUsed = 0

    if(limit === 0) {
      theLimitUsed = 0
    } else if(borrowAmount && borrowAmount !== '') {
      theLimitUsed = (limitUsed+(borrowAmount*asset.price))*100/limit
    } else if(repayAmount && repayAmount !== '') {
      theLimitUsed = (limitUsed-(repayAmount*asset.price))*100/limit
    } else {
      theLimitUsed = (limitUsed)*100/limit
    }
    if (isNaN(theLimitUsed)) {
      theLimitUsed = 0
    }

    // console.log(BigNumber(repayAmount))
    // console.log(BigNumber(asset.borrowBalance))
    // console.log(BigNumber(repayAmount).gt(BigNumber(asset.borrowBalance)))

    return (
      <div className={ classes.assetActions }>
        <div className={ classes.assetInfo }>
          <div className={ classes.assetSummarySectionheader }>
            <Typography variant={ 'h4' } color='primary' noWrap>Borrow { asset.symbol }</Typography>
          </div>
          <div className={ classes.infoField }>
            <Typography variant={ 'h5' } className={ classes.grey }>Borrow limit:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h3' } noWrap>$ { limit ? limit.toFixed(2) : '0.00' }</Typography>
            </div>
          </div>
          <div className={ classes.infoField }>
            <Typography variant={ 'h5' } className={ classes.grey }>Borrow limit used:</Typography>
            <div className={ classes.flexy }>
              <Typography variant={ 'h3' } noWrap>{ theLimitUsed.toFixed(2) }%</Typography>
            </div>
          </div>
        </div>
        <div className={ classes.fullWidth }></div>
        <div className={ classes.actionsContainer }>
          <div className={ classes.tradeContainer }>
            <div className={ classes.balances }>
              <Typography variant='h4' className={ classes.value } noWrap>~</Typography>
            </div>
            <TextField
              fullWidth
              className={ classes.actionInput }
              id='borrowAmount'
              value={ borrowAmount }
              error={ borrowAmountError }
              onChange={ this.onChange }
              disabled={ loading }
              placeholder="0.00"
              variant="outlined"
            />
            <div className={ classes.scaleContainer }>
              <div className={ classes.emptyScale }></div>
            </div>
            <div className={ classes.buttons }>
              <Button
                className={ classes.actionButton }
                variant="contained"
                color="primary"
                disabled={ loading || theLimitUsed > 100 || !borrowAmount || borrowAmount < 0 || limit === 0  }
                onClick={ this.onBorrow }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>
                  { (theLimitUsed > 100 || limit === 0) && 'Insufficient collateral' }
                  { (theLimitUsed <= 100 && limit > 0) && 'Borrow' }
                </Typography>
              </Button>
            </div>
          </div>
          <div className={ classes.sepperator }></div>
          <div className={classes.tradeContainer}>
            <div className={ classes.balances }>
              <Typography variant='h4' onClick={ () => { this.setRepayAmount(100) } }  className={ classes.value } noWrap>{ 'Wallet: ' + (asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset.symbol }</Typography>
            </div>
            <TextField
              fullWidth
              className={ classes.actionInput }
              id='repayAmount'
              value={ repayAmount }
              error={ repayAmountError }
              onChange={ this.onChange }
              disabled={ loading }
              placeholder="0.00"
              variant="outlined"
              onKeyDown={ this.inputRedeemKeyDown }
            />
            <div className={ classes.scaleContainer }>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setRepayAmount(25) } }>
                <Typography variant={'h5'}>25%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setRepayAmount(50) } }>
                <Typography variant={'h5'}>50%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setRepayAmount(75) } }>
                <Typography variant={'h5'}>75%</Typography>
              </Button>
              <Button
                className={ classes.scale }
                variant='text'
                disabled={ loading }
                color="primary"
                onClick={ () => { this.setRepayAmount(100) } }>
                <Typography variant={'h5'}>100%</Typography>
              </Button>
            </div>
            <div className={ classes.buttons }>
              <Button
                className={ classes.actionButton }
                variant="contained"
                color="primary"
                disabled={ loading || asset.borrowBalance === 0 || !repayAmount || BigNumber(repayAmount).gt(BigNumber(asset.balance)) || BigNumber(repayAmount).gt(BigNumber(asset.borrowBalance)) }
                onClick={ this.onRepay }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} >
                  { asset.borrowBalance === 0 && 'No Balance to Repay' }
                  { asset.borrowBalance > 0 && BigNumber(repayAmount).gt(BigNumber(asset.balance)) && 'Insufficient Balance' }
                  { asset.borrowBalance > 0 && BigNumber(repayAmount).gt(BigNumber(asset.borrowBalance)) && 'Insufficient Borrowed' }
                  { asset.borrowBalance > 0 && (!repayAmount || (BigNumber(repayAmount).lte(BigNumber(asset.balance)) && BigNumber(repayAmount).lte(BigNumber(asset.borrowBalance)))) && 'Repay' }
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getLogo = (address) => `https://raw.githubusercontent.com/iearn-finance/yearn-assets/master/icons/tokens/${address}/logo-128.png`

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onBorrow = () => {
    this.setState({ borrowAmountError: false })

    const { borrowAmount } = this.state
    const { asset, startLoading } = this.props

    if(!borrowAmount || isNaN(borrowAmount) || borrowAmount <= 0) {
      this.setState({ borrowAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: LENDING_BORROW, content: { amount: borrowAmount, asset: asset } })
  }

  onRepay = () => {
    this.setState({ repayAmountError: false })

    const { asset, startLoading  } = this.props
    let repayAmount = this.state.repayAmount

    if(!repayAmount || isNaN(repayAmount) || repayAmount <= 0) {
      this.setState({ repayAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: LENDING_REPAY, content: { amount: repayAmount, asset: asset } })
  }

  setRepayAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const amount = BigNumber(asset.borrowBalance).times(percent).div(100).toFixed(asset.decimals)

    this.setState({ repayAmount: amount })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(BorrowAsset));
