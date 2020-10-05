import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import MainContainer from '../mainContainer';
import Store from "../../stores";
import { DRAWER_RETURNED, TOGGLE_DRAWER } from '../../constants/constants';

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: {
    minHeight: '96px',
    [theme.breakpoints.down('sm')]: {
      minHeight: '73px'
    }
  },
  selected: {
    backgroundColor: '#efefef'
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

  nav = (screen) => {
    if(screen === 'cover') {
      window.open("https://yinsure.finance", "_blank")
      return
    }
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
        }}
      >
        <MainContainer />
        <List>
          <ListItem button key={'Dashboard'} className={ (this.linkSelected('/dashboard'))?classes.selected:'' } onClick={ () => { this.nav('dashboard') } }>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary={'Dashboard'} />
          </ListItem>

          <ListItem button key={'Portfolio'} className={ (this.linkSelected('/portfolio'))?classes.selected:'' } onClick={ () => { this.nav('portfolio') } }>
            <ListItemIcon><ShoppingBasketIcon /></ListItemIcon>
            <ListItemText primary={'Portfolio'} />
          </ListItem>
        </List>
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
        <MainContainer />
        <List>
          <ListItem button key={'Dashboard'} className={ (this.linkSelected('/dashboard'))?classes.selected:'' } onClick={ () => { this.nav('dashboard') } }>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary={'Dashboard'} />
          </ListItem>

          <ListItem button key={'Portfolio'} className={ (this.linkSelected('/portfolio'))?classes.selected:'' } onClick={ () => { this.nav('portfolio') } }>
            <ListItemIcon><ShoppingBasketIcon /></ListItemIcon>
            <ListItemText primary={'Portfolio'} />
          </ListItem>
        </List>
      </Drawer>
    );
  }

  linkSelected = (link) => {
    return window.location.pathname === link
  }
}

export default withRouter(withStyles(styles)(SideDrawer));