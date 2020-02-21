import { AppBar, Divider, Drawer, Hidden, IconButton, List, Toolbar, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AttachMoney, FlashOn, Home, Menu, TrendingUp } from '@material-ui/icons';
import React from 'react';
import Footer from '../footer';
import ListItemLink from '../listItemLink';


const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing * 2,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default
  }
})

const links = [
  {id: 'home', title:'Home', icon: <Home />, path: '/home'},
  {id: 'earn', title:'Earn', icon: <AttachMoney />, path: '/earn'},
  {id: 'zap', title:'Zap', icon: <FlashOn />, path: '/zap'},
  {id: 'apr', title:'APR', icon: <TrendingUp />, path: '/apr'},
  // {id: 'idai', title:'IDai', icon: <Mail />, path: '/idai'},
  // {id: 'performance', title:'Performance', icon: <Mail />, path: '/performance'},
  // {id: 'manage', title:'Manage', icon: <Mail />, path: '/manage'},
  // {id: 'insure', title:'Insure', icon: <Mail />, path: '/insure'},
]

const AppLayout = (props) => {
  const { classes } = props;

  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <>
      <Toolbar>
        <Typography variant="h2">iEarn</Typography>
      </Toolbar>
      <Divider />
      <List>
        {links.map(link => (
          <ListItemLink key={link.id} link={link} />
        ))}
      </List>
    </>
  )

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color='transparent' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
        <Footer />
      </main>
    </div>
  )
}

export default withStyles(styles)(AppLayout);