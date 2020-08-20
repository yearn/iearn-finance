import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
  },
  rootBeta: {
    background: '#EFDBFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
  },
  betaIco:{
    maxWidth: '15px',
    width: '100%',
    height: 'auto',
    marginRight: '9px'
  },
  betaText: {
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '22px',
    color: '#080809',
  },
  item: {
    color: '#888A8C',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    transition: 'color 0.3s',
  },
  menuItem: {
    padding: '8px 13px',
    cursor: 'pointer',
    display: 'flex',
    maxWidth: 'max-content',
    alignItems: 'center',
    margin: '0 15px',
    '&:hover': {
      '& h3': {
        color: '#676767',
        transition: 'color 0.3s',
      },
    },
    '&:first-of-type': {
      marginLeft: '0',
    },
    '&:last-of-type': {
      marginRight: '0',
    },
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: "#fff",
  },
  
});

const HeaderNew = (props) => {
  const {
    classes,
    headerValue
  } = props;

  const nav = (screen) => {
    props.history.push('#'+screen)
  }

  return (
    <div className={ classes.root }>
      <div className={classes.rootBeta}>
        <img className={classes.betaIco} src={ require('../../assets/header-beta-icon.svg') } alt="beta icon" />
        <Typography variant={'h6'} className={classes.betaText}>This project is in beta. Use at your own risk.</Typography>
      </div>

      <div className={classes.menuContainer}>
        <div className={classes.menuItem} onClick={ () => { nav('') } }>
          <Typography variant={'h3'} className={classes.item}>FAQ</Typography>
        </div>
        <div className={classes.menuItem} onClick={ () => { nav('') } }>
          <Typography variant={'h3'} className={classes.item}>yCosystem</Typography>
        </div>
        <div className={classes.menuItem} onClick={ () => { nav('') } }>
          <img style={{marginRight: '8px'}} src={ require('../../assets/learn-yearn.png') } alt="learn-yearn" />
          <Typography variant={'h3'} className={classes.item}>Learn Yearn</Typography>
        </div>
        <div className={classes.menuItem} onClick={ () => { nav('') } }>
          <Typography variant={'h3'} className={classes.item}>View Strategies</Typography>
        </div>
        <div className={classes.menuItem} onClick={ () => { nav('') } }>
          <Typography variant={'h3'} className={classes.item}>Yearn Stats</Typography>
        </div>
        <div className={classes.menuItem} onClick={ () => { nav('') } }>
          <Typography variant={'h3'} className={classes.item}>Wallet Stats</Typography>
        </div>
        <div className={classes.menuItem} onClick={ () => { nav('') } }>
          <Typography variant={'h3'} className={classes.item}>Governance Stats</Typography>
        </div>
        <div className={classes.menuItem} onClick={ () => { nav('') } }>
          <Typography variant={'h3'} className={classes.item}>Governance</Typography>
        </div>
      </div>
    </div>
  )
}

export default withRouter(withStyles(styles)(HeaderNew));
