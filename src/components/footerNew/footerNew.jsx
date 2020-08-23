import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';
import {
  Link
} from "react-router-dom";
import { withNamespaces } from 'react-i18next';

import BuiltWithModal from '../builtwith/builtwithModal.jsx'


const styles = theme => ({
  footer: {
    padding: '70px 10px 20px',
    width: '100%',
  },
  container: {
    maxWidth: '515px',
    width: '100%',
    margin: '0 auto',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  icon: {
    padding: '3px',
    cursor: 'pointer',
    margin: '0 20px',
    '&:first-of-type': {
      marginLeft: '0',
    },
    '&:last-of-type': {
      marginRight: '0',
    },
  },
  menuContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    borderTop: '1px solid #D5D7D9',
    marginTop: '16px',
    paddingTop: '17px',
  },
  menuContainerDark: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    borderTop: '1px solid #535963',
    marginTop: '16px',
    paddingTop: '17px',
  },
  link: {
    textDecoration: 'none',
  },
  menuItem: {
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '22px',
    color: '#575859',
    cursor: 'pointer',
    padding: '3px 5px',
    margin: '0 25px',
    '&:first-of-type': {
      marginLeft: '50px',
    },
    '&:last-of-type': {
      marginRight: '0',
    },
  },
  menuItemDark: {
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '22px',
    color: '#D5D7D9',
    cursor: 'pointer',
    padding: '3px 5px',
    margin: '0 25px',
    '&:first-of-type': {
      marginLeft: '50px',
    },
    '&:last-of-type': {
      marginRight: '0',
    },
  }
});

const FooterNew = (props) => {
  const [modal, setModal] = useState(false)
  const { classes, isDarkTheme } = props;

  const renderBuiltWithModal = () => {
    return (
      <BuiltWithModal closeModal={ closeBuiltWithModal } modalOpen={ modal } />
    )
  }

  const builtWithOverlayClicked = () => {
    return setModal(true)
  }

  const closeBuiltWithModal = () => {
    return setModal(false)
  }

  return(
    <div className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.iconContainer}>
          {isDarkTheme ? (
            <>
              <img className={classes.icon} onClick={()=> window.open("https://github.com/iearn-finance/iearn-finance", "_blank")} src={ require('../../assets/footer/footer-icon-dark-1.svg') } alt="github" />
              <img className={classes.icon} onClick={()=> window.open("https://t.me/yearnfinance", "_blank")} src={ require('../../assets/footer/footer-icon-dark-2.svg') } alt="telegram" />
              <img className={classes.icon} onClick={()=> window.open("https://discord.gg/CjehUmW", "_blank")} src={ require('../../assets/footer/footer-icon-dark-3.svg') } alt="discord" />
              <img className={classes.icon} onClick={()=> window.open("https://twitter.com/iearnfinance", "_blank")} src={ require('../../assets/footer/footer-icon-dark-4.svg') } alt="twitter" />
              <img className={classes.icon} onClick={()=> window.open("https://medium.com/iearn", "_blank")} src={ require('../../assets/footer/footer-icon-dark-5.svg') } alt="medium" />
            </>
          ) : (
            <>
              <img className={classes.icon} onClick={()=> window.open("https://github.com/iearn-finance/iearn-finance", "_blank")} src={ require('../../assets/footer/footer-icon-1.svg') } alt="github" />
              <img className={classes.icon} onClick={()=> window.open("https://t.me/yearnfinance", "_blank")} src={ require('../../assets/footer/footer-icon-2.svg') } alt="telegram" />
              <img className={classes.icon} onClick={()=> window.open("https://discord.gg/CjehUmW", "_blank")} src={ require('../../assets/footer/footer-icon-3.svg') } alt="discord" />
              <img className={classes.icon} onClick={()=> window.open("https://twitter.com/iearnfinance", "_blank")} src={ require('../../assets/footer/footer-icon-4.svg') } alt="twitter" />
              <img className={classes.icon} onClick={()=> window.open("https://medium.com/iearn", "_blank")} src={ require('../../assets/footer/footer-icon-5.svg') } alt="medium" />
            </>
          )}
          
        </div>
        <div className={ isDarkTheme ? classes.menuContainerDark : classes.menuContainer}>
          <Link to={"/"} className={ classes.link }>
            <Typography className={ isDarkTheme ? classes.menuItemDark : classes.menuItem } style={{marginLeft: '0'}} variant={ 'h6'}>Home</Typography>
          </Link>
          <Typography onClick={()=> window.open("https://docs.yearn.finance", "_blank")} className={ isDarkTheme ? classes.menuItemDark : classes.menuItem } variant={ 'h6'}>About</Typography>
          <Typography onClick={()=> window.open("https://docs.yearn.finance", "_blank")} className={ isDarkTheme ? classes.menuItemDark : classes.menuItem } variant={ 'h6'}>Docs</Typography>
          <Typography onClick={()=> window.open("https://github.com/iearn-finance", "_blank")} className={ isDarkTheme ? classes.menuItemDark : classes.menuItem } variant={ 'h6'}>Code</Typography>
          <Typography onClick={ builtWithOverlayClicked } className={ isDarkTheme ? classes.menuItemDark : classes.menuItem } variant={ 'h6'}>Builtwith</Typography>
        </div>
      </div>
      { modal && renderBuiltWithModal() }
    </div>
  )
}

export default withNamespaces()(withRouter(withStyles(styles)(FooterNew)));
