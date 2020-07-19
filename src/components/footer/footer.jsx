import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import {
  Link
} from "react-router-dom";
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
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    }
  },
  footerLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '420px'
  },
  footerText: {
    cursor: 'pointer'
  },
  languageContainer: {
    paddingLeft: '12px',
    display: 'none'
  },
  selectInput: {
    fontSize: '14px',
    color: colors.pink
  },
  link: {
    textDecoration: 'none'
  }
});


class Footer extends Component {

  constructor(props) {
    super()

    this.state = {
      languages: store.getStore('languages'),
      language: 'en',
      modalBuiltWithOpen: false,
    }
  }

  render() {
    const { classes, t, location } = this.props;
    const {
      modalBuiltWithOpen,
      languages,
      language
    } = this.state

    if(!location.pathname.includes('/earn') && !location.pathname.includes('/zap') && !location.pathname.includes('/cover') && !location.pathname.includes('/apr') && !location.pathname.includes('/pool') && !location.pathname.includes('/balancer') ) {
      return null
    }

    return (
      <div className={classes.footer}>
        <div className={classes.footerLinks}>
          <Link to={"/"} className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>{ t('Footer.Home') }</Typography>
          </Link>
          {/*<Link to={"/zap"} className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>{ t('Footer.Zap') }</Typography>
          </Link>
          <Link to={"/insure"} className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>{ t('Footer.Insure') }</Typography>
          </Link>
          <Link to={"/apr"} className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>{ t('Footer.Yield') }</Typography>
          </Link>*/}
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>{ t('Footer.About') }</Typography>
          <Typography onClick={()=> window.open("https://docs.iearn.finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>{ t('Footer.Docs') }</Typography>
          <Typography onClick={()=> window.open("https://github.com/iearn-finance", "_blank")} className={ classes.footerText } variant={ 'h6'}>{ t('Footer.Code') }</Typography>
          <Typography onClick={()=> window.open("https://t.me/iearnfinance", "_blank")} className={ classes.footerText } variant={ 'h6'}>{ t('Footer.Telegram') }</Typography>
          <Typography onClick={ this.builtWithOverlayClicked } className={ classes.footerText } variant={ 'h6'}>{ t('Footer.BuiltWith') }</Typography>
        </div>
        <div className={ classes.languageContainer }>
          <FormControl variant="outlined">
            <Select
              id="language"
              value={ language }
              onChange={ this.handleLanguageChange }
              inputProps={{ className: classes.selectInput }}
              color="primary"
              fullWidth
            >
              { languages.map((language) => {
                return <MenuItem key={ language.code } value={ language.code }>{ language.language }</MenuItem>
              })}
            </Select>
          </FormControl>
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

  handleLanguageChange = (event) => {
    let val = []
    val.language = event.target.value
    this.setState(val)

    i18n.changeLanguage(event.target.value)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Footer)));
