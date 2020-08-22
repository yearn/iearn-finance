import React,{ useState} from 'react'
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';
import {Button,Typography, Switch} from '@material-ui/core'
import UnlockModal from '../unlock/unlockModal'
import SoonModal from '../soonModal/soonModal'

const styles = theme => ({
  buttonText: {
    fontWeight: '700',
    alignItems: 'center',
    display: 'flex',
    fontSize: '14px',
    lineHeight: '22px',
  },
  actionButton: {
    fontWeight: '600',
    fontSize: '16px',
    lineLeight: '24px',
    padding: '8px 13px',
    margin: '15px 8px 0',
    borderRadius: '4px',
    boxShadow: 'none',
    '&:first-of-type': {
      marginLeft: '0',
    },
    '&:last-of-type': {
      marginRight: '0',
    },
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'inherit',
    flexWrap: 'wrap',
    marginTop: '21px',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '30px',
    lineHeight: '38px',
    color: '#080809',
    marginTop: '54px'
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#080809',
    marginTop: '22px'
  },
  container: {
    padding: '36px 0 53px'
  },
  vLine: {
    width: '1px',
    height: '44px',
    background: '#D5D7D9',
    margin: '15px 8px 0',
  },
  pulsingButton: {
    animation: '$pulse-animation 2s infinite'
  },
  '@keyframes pulse-animation': {
    '0%': {
      boxShadow: '0 0 0 0px rgba(47, 128, 237, 0.5)'
    },
    '100%': {
      boxShadow: '0 0 0 10px rgba(47, 128, 237, 0)'
    }
  }
})

const TopBar = ({ account, classes, nav, currentPage, pageTitle, pageSubtitle, isDarkTheme, setIsDarkTheme }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [soonModalOpen, setSoonModalOpen] = useState(false)
  return (
      <div className={ classes.container }>
        <div className={ classes.logoContainer }>
          <img src={require(`../../assets/logo-top.svg`)} alt="" />
        </div>
        <div className={ classes.menuContainer }>
          <Button
            className={ classes.actionButton }
            variant="contained"
            color={currentPage === '/' ? 'primary' : 'secondary'}
            onClick={() => window.open('https://ycosystem.info/')}
          >
            <img src={require(`../../assets/ico-ycosystem.svg`)} style={{paddingRight: '5px'}} alt="" />
            yCosystem
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            color={currentPage === '/' ? 'primary' : 'secondary'}
            onClick={() => !!account && !!account.address
              ? window.open(`https://zapper.fi/dashboard?address=${account.address}`)
              : setModalOpen(true)}
          >
            <img src={require(`../../assets/ico-dashboard.svg`)} alt="" />
            {' '}
            Dashboard
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            
            onClick={() => nav('/zap')}
            color={currentPage === '/zap' ? 'primary' : 'secondary'}
          >
            <img src={require(`../../assets/ico-zapper.svg`)} alt="" />
            {' '}
            Zapper
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            
            onClick={() => nav('/vaults')}
            color={currentPage === '/vaults' ? 'primary' : 'secondary'}
          >
            <img src={require(`../../assets/${currentPage === '/vaults' ? 'ico-grow' : 'ico-grow-light'}.svg`)} alt="" />
            {' '}
            Grow
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            
            onClick={() => nav('/earn')}
            color={currentPage === '/earn' ? 'primary' : 'secondary'}
          >
            <img src={require(`../../assets/ico-save.svg`)} alt="" />
            {' '}
            Save
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            onClick={() => setSoonModalOpen(true)}
            color={'secondary'}
          >
            <img src={require(`../../assets/ico-cover.svg`)} alt="" />
            {' '}
            Cover
          </Button>
          <div className={ classes.vLine }/>
          <Button
            className={`${classes.actionButton} ${!account || !account.address ? classes.pulsingButton : ''}` }
            variant="contained"
            color="secondary"
            onClick={() => setModalOpen(true)}
            // fullWidth
          >
            {!account || !account.address ? (
              <Typography variant={'h5'}>Connect Wallet</Typography>
            ) : (
              <Typography className={ classes.buttonText } variant={'h5'} >
                <img src={require(`../../assets/ico-wallet.svg`)} alt="" />
                {' '}
                {`${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4, account.address.length)}`}
              </Typography>
            )}
          </Button>
          <Switch
            checked={isDarkTheme}
            onChange={setIsDarkTheme}
            name="theme-chooser"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
        <div >
          <Typography className={ classes.title } variant={'h2'} >{pageTitle}</Typography>
          <Typography className={ classes.subTitle } variant={'h3'} >{pageSubtitle}</Typography>
        </div>
        {modalOpen && <UnlockModal closeModal={() => setModalOpen(false)} modalOpen={modalOpen} />}
        {soonModalOpen && <SoonModal closeModal={() => setSoonModalOpen(false)} isOpen={soonModalOpen} />}
      </div>

  )
}

export default withNamespaces()(withRouter(withStyles(styles)(TopBar)))