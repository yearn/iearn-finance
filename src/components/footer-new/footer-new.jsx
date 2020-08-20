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
  icon_container: {
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
  menu_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    borderTop: '1px solid #D5D7D9',
    marginTop: '16px',
    paddingTop: '17px',
  },
  link: {
    textDecoration: 'none',
  },
  menu_item: {
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
});

const FooterNew = (props) => {
  const [modal, setModal] = useState(false)
  const { classes } = props;

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
        <div className={classes.icon_container}>
          <img className={classes.icon} onClick={()=> window.open("#", "_blank")} src={ require('../../assets/footer/footer-icon-1.svg') } alt="github" />
          <img className={classes.icon} onClick={()=> window.open("#", "_blank")} src={ require('../../assets/footer/footer-icon-2.svg') } alt="telegram" />
          <img className={classes.icon} onClick={()=> window.open("#", "_blank")} src={ require('../../assets/footer/footer-icon-3.svg') } alt="discord" />
          <img className={classes.icon} onClick={()=> window.open("#", "_blank")} src={ require('../../assets/footer/footer-icon-4.svg') } alt="twitter" />
          <img className={classes.icon} onClick={()=> window.open("#", "_blank")} src={ require('../../assets/footer/footer-icon-5.svg') } alt="github" />
          <img className={classes.icon} onClick={()=> window.open("#", "_blank")} src={ require('../../assets/footer/footer-icon-6.svg') } alt="mail" />
        </div>
        <div className={classes.menu_container}>
          <Link to={"/"} className={ classes.link }>
            <Typography className={ classes.menu_item } style={{marginLeft: '0'}} variant={ 'h6'}>Home</Typography>
          </Link>
          <Typography onClick={()=> window.open("https://docs.yearn.finance", "_blank")} className={ classes.menu_item } variant={ 'h6'}>About</Typography>
          <Typography onClick={()=> window.open("https://docs.yearn.finance", "_blank")} className={ classes.menu_item } variant={ 'h6'}>Docs</Typography>
          <Typography onClick={()=> window.open("https://github.com/iearn-finance", "_blank")} className={ classes.menu_item } variant={ 'h6'}>Code</Typography>
          <Typography onClick={ builtWithOverlayClicked } className={ classes.menu_item } variant={ 'h6'}>Builtwith</Typography>
        </div>
      </div>
      { modal && renderBuiltWithModal() }
    </div>
  )
}

export default withNamespaces()(withRouter(withStyles(styles)(FooterNew)));
