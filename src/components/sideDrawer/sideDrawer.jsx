import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import { Drawer, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import Store from "../../stores";
import { DRAWER_RETURNED, TOGGLE_DRAWER } from '../../constants/constants';
import { drawerWidth } from "../../theme/theme";

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: '26px',
    boxShadow: '0px 4px 30px rgba(204, 204, 204, 0.25)',
  },
  drawerLeft: {
    borderRight: 0
  },
  toolbar: {
    minHeight: '96px',
    [theme.breakpoints.down('sm')]: {
      minHeight: '73px'
    }
  },
  selected: {
    color: '#18A0FB',
  },
  icon: {
    width: '100%'
  },
  paddingGitter: {
    paddingLeft: '16px',
    paddingRight: '16px'
  },
  footerMenu: {
    position: 'absolute',
    bottom: '5%'
  }
})

class SideDrawer extends Component {
  constructor(props) {
    super()

    this.state = {
      hideNav: true,
      openDrawer: store.getStore('openDrawer'),
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    emitter.on(DRAWER_RETURNED, this.toggleDrawer)
    this.resize();
  }

  componentWillUnmount() {
    emitter.removeListener(DRAWER_RETURNED, this.toggleDrawer)
    window.removeEventListener("resize", this.resize.bind(this));
  }

  resize() {
    let currentHideNav = (window.innerWidth <= 760);
    if (currentHideNav !== this.state.hideNav) {
        this.setState({hideNav: currentHideNav});
    }
  }

  render() {
    return this.renderDrawer();
  }

  toggleDrawer = () => {
    this.setState({ openDrawer: store.getStore('openDrawer') })
  }

  dispatchToggle = () => {
    dispatcher.dispatch({ type: TOGGLE_DRAWER, content: { open: false } })
  }

  nav = (url) => {
    window.open(url, '_blank')
  }

  navInApp(screen) {
    this.props.history.push('/'+screen)
  }

  renderDrawer = () => {
    const { 
      classes
    } = this.props;

    const {
      hideNav
    } = this.state;

    if (hideNav) {
      return this.renderSideDrawer();
    } 

    return (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
          paperAnchorLeft: classes.drawerLeft,
        }}
      >
        <div className={ classes.icon }>
          <img
            alt=""
            src={ require('../../assets/DAOventures-logo.png') }
            height={ '30px' }
            style={{ cursor: 'pointer' }}
            onClick={ () => { this.nav('https://daoventures.co/') } }
          />
        </div>
        <List>
          <ListItem button key={'Invest'} className={ (this.linkSelected('/invest'))? classes.selected:'' } onClick={ () => { this.navInApp('invest') } }>
            <ListItemIcon>
              {this.renderIcon('line-chart', '/invest')}
            </ListItemIcon>
            <ListItemText primary={'Invest'} />
          </ListItem>

          <ListItem button key={'Portfolios'} className={ (this.linkSelected('/portfolio'))?classes.selected:'' } onClick={ () => { this.navInApp('portfolio') } }>
            <ListItemIcon>
              {this.renderIcon('pie-chart', '/portfolio')}
            </ListItemIcon>
            <ListItemText primary={'Portfolios'} />
          </ListItem>
        </List>

        {this.renderFooterMenu()}
      </Drawer>
    );
  }

  renderSideDrawer = () => {
    const { 
      classes
    } = this.props;

    return (
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={this.state.openDrawer} 
        onClose={this.dispatchToggle}
      >
        <List>
          <ListItem button key={'Invest'} className={ (this.linkSelected('/invest'))? classes.selected:'' } onClick={ () => { this.navInApp('invest') } }>
            <ListItemIcon>
              {this.renderIcon('line-chart', '/invest')}
            </ListItemIcon>
            <ListItemText primary={'Invest'} />
          </ListItem>

          <ListItem button key={'Portfolios'} className={ (this.linkSelected('/portfolio'))?classes.selected:'' } onClick={ () => { this.navInApp('portfolio') } }>
            <ListItemIcon>
              {this.renderIcon('pie-chart', '/portfolio')}
            </ListItemIcon>
            <ListItemText primary={'Portfolios'} />
          </ListItem>
        </List>

        {this.renderFooterMenu()}
      </Drawer>
    );
  }

  renderFooterMenu = () => {
    const { classes } = this.props;

    return (
      <div className={classes.footerMenu}>
          <List>
            <ListItem button key={'Your Feedback'} className={ (this.linkSelected('/user-feedback'))?classes.selected:'' } onClick={ () => { this.nav('http://feedback.daoventures.co/beta-product-v1') } }>
              <ListItemText primary={'Your Feedback'} />
            </ListItem>

            <ListItem button key={'FAQ'} className={ (this.linkSelected('/faq'))? classes.selected:'' } onClick={ () => { this.nav('https://daoventures.gitbook.io/daoventures/frequently-asked-question') } }>
              <ListItemText primary={'FAQ'} />
            </ListItem>

            <ListItem button key={'About Us'} className={ (this.linkSelected('/about-us'))?classes.selected:'' } onClick={ () => { this.nav('https://daoventures.co/about.html') } }>
              <ListItemText primary={'About Us'} />
            </ListItem>
          </List>

          <Grid container spacing={2} className={classes.paddingGitter}>
            <Grid item>
              <img alt="" src={require('../../assets/reddit.svg')} style={{ cursor: 'pointer' }} onClick={ () => { this.nav('https://www.reddit.com/r/DAOVentures/') } } />
            </Grid>
            <Grid item>
              <img alt="" src={require('../../assets/twitter.svg')} style={{ cursor: 'pointer' }} onClick={ () => { this.nav('https://twitter.com/VenturesDao') } } />
            </Grid>
            <Grid item>
              <img alt="" src={require('../../assets/facebook.svg')} style={{ cursor: 'pointer' }} onClick={ () => { this.nav('https://www.facebook.com/DAOventuresCo/') } } />
            </Grid>
            <Grid item>
              <img alt="" src={require('../../assets/medium.svg')} style={{ cursor: 'pointer' }} onClick={ () => { this.nav('https://daoventuresco.medium.com/ ') } } />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={classes.paddingGitter}>
            <Grid item>
              <img alt="" src={require('../../assets/slack.svg')} style={{ cursor: 'pointer' }} onClick={ () => { this.nav('https://join.slack.com/t/daoventures/shared_invite/zt-k4hmm44g-p5ME~5I~fm0pkfY2U8AUIw') } } />
            </Grid>
            <Grid item>
              <img alt="" src={require('../../assets/linkedin.svg')} style={{ cursor: 'pointer' }} onClick={ () => { this.nav('https://www.linkedin.com/company/daoventuresco/') } } />
            </Grid>
            <Grid item>
              <img alt="" src={require('../../assets/email.svg')} style={{ cursor: 'pointer' }} onClick={ () => { this.nav('mailto:support@daoventures.co') } } />
            </Grid>
            <Grid item>
              <img alt="" src={require('../../assets/telegram.svg')} style={{ cursor: 'pointer' }} onClick={ () => { this.nav('https://t.me/DAOventures') } } />
            </Grid>
          </Grid>
        </div>
    )
  }

  renderIcon = (name, url) => {
    if (this.linkSelected(url)) {
      return (
        <img 
          alt=""
          src={ require(`../../assets/${name}_blue.svg`) } /> 
      );
    } else {
      return (
        <img 
          alt=""
          src={ require(`../../assets/${name}.svg`) } /> 
      );
    }
  }

  linkSelected = (link) => {
    return window.location.pathname === link
  }
}

export default withRouter(withStyles(styles)(SideDrawer));