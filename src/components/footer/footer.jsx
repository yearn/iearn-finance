import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import i18n from '../../i18n';
import { colors } from '../../theme'

import BuiltWithModal from '../builtwith/builtwithModal.jsx'

import Store from "../../stores";
const store = Store.store

const styles = theme => ({
  footer: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    background: colors.white,
    borderRadius: '50px 50px 0px 0px',
    border: '1px solid '+colors.borderBlue,
    borderBottom: 'none',
    marginTop: '48px'
  },
  heading: {
    marginBottom: '12px',
    paddingBottom: '9px',
    borderBottom: "3px solid "+colors.borderBlue,
    width: 'fit-content'
  },
  link: {
    paddingBottom: '12px',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }

});


class Footer extends Component {

  constructor(props) {
    super()

    this.state = {
      modalBuiltWithOpen: false,
    }
  }

  render() {
    const { classes, t, location } = this.props;
    const {
      modalBuiltWithOpen
    } = this.state

    if(location.pathname === '' || location.pathname === '/') {
      return null
    }

    return (
      <div className={classes.footer}>
        <div className={ classes.socials }>
          <Typography className={ classes.heading } variant={ 'h6'}>Products</Typography>
          <Typography onClick={()=> window.open("https://yearn.finance", "_blank")} className={ classes.link } variant={ 'h4'} >yearn.finance</Typography>
          <Typography onClick={()=> window.open("https://ygov.finance", "_blank")} className={ classes.link } variant={ 'h4'} >ygov.finance</Typography>
          <Typography onClick={()=> window.open("https://yinsure.finance", "_blank")} className={ classes.link } variant={ 'h4'} >yinsure.finance</Typography>
          <Typography onClick={()=> window.open("https://yborrow.finance", "_blank")} className={ classes.link } variant={ 'h4'} >yborrow.finance</Typography>
          <Typography onClick={()=> window.open("https://docs.yearn.finance", "_blank")} className={ classes.link } variant={ 'h4'} >docs.yearn.finance</Typography>
        </div>
        <div className={ classes.socials }>
          <Typography className={ classes.heading } variant={ 'h6'}>Community</Typography>
          <Typography onClick={()=> window.open("https://ycosystem.info", "_blank")} className={ classes.link } variant={ 'h4'} >ycosystem.info</Typography>
          <Typography onClick={()=> window.open("https://www.learnyearn.finance", "_blank")} className={ classes.link } variant={ 'h4'} >learnyearn.finance</Typography>
          <Typography onClick={()=> window.open("https://stats.finance/yearn", "_blank")} className={ classes.link } variant={ 'h4'} >stats.finance</Typography>
          <Typography onClick={()=> window.open("https://yieldfarming.info", "_blank")} className={ classes.link } variant={ 'h4'} >yieldfarming.info</Typography>
          <Typography onClick={()=> window.open("https://feel-the-yearn.app", "_blank")} className={ classes.link } variant={ 'h4'} >feel-the-yearn.app</Typography>
          <Typography onClick={()=> window.open("https://yearn.snapshot.page", "_blank")} className={ classes.link } variant={ 'h4'} >yearn.snapshot.page</Typography>
        </div>
        <div className={ classes.socials }>
          <Typography className={ classes.heading } variant={ 'h6'}>Socials</Typography>
          <Typography onClick={()=> window.open("https://twitter.com/iearnfinance", "_blank")} className={ classes.link } variant={ 'h4'} >Twitter</Typography>
          <Typography onClick={()=> window.open("https://medium.com/iearn", "_blank")} className={ classes.link } variant={ 'h4'} >Medium</Typography>
          <Typography onClick={()=> window.open("https://discord.gg/GcjxhWR", "_blank")} className={ classes.link } variant={ 'h4'} >Discord</Typography>
          <Typography onClick={()=> window.open("https://t.me/yearnfinance", "_blank")} className={ classes.link } variant={ 'h4'} >Telegram</Typography>
          <Typography onClick={()=> window.open("https://github.com/iearn-finance", "_blank")} className={ classes.link } variant={ 'h4'} >Github</Typography>
        </div>
        { modalBuiltWithOpen && this.renderBuiltWithModal() }
      </div>
    )
  }

  renderBuiltWithModal = () => {
    return (
      <BuiltWithModal closeModal={ this.closeBuiltWithModal } modalOpen={ this.state.modalBuiltWithOpen } />
    )
  }

  builtWithOverlayClicked = () => {
    this.setState({ modalBuiltWithOpen: true })
  }

  closeBuiltWithModal = () => {
    this.setState({ modalBuiltWithOpen: false })
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Footer)));
