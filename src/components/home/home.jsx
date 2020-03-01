import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'
import FlashOnIcon from '@material-ui/icons/FlashOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SecurityIcon from '@material-ui/icons/Security';
import BarChartIcon from '@material-ui/icons/BarChart';

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },
  card: {
    flex: '1',
    height: '25vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    borderRadius: '0px',
    transition: 'background-color 0.2s linear',
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
      minWidth: '20%',
      minHeight: '50vh',
    }
  },
  earn: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.pink,
      '& .title': {
        color: colors.white
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.pink
    },
    '& .icon': {
      color: colors.pink
    }
  },
  zap: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.blue,
      '& .title': {
        color: colors.white,
        display: 'none'
      },
      '& .soon': {
        color: colors.white,
        display: 'block'
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.blue,
      display: 'block'
    },
    '& .soon': {
      color: colors.blue,
      display: 'none'
    },
    '& .icon': {
      color: colors.blue
    },
  },
  apr: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.lightBlack,
      '& .title': {
        color: colors.white
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.lightBlack
    },
    '& .icon': {
      color: colors.lightBlack
    },
  },
  cover: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.compoundGreen,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.compoundGreen,
    },
    '& .icon': {
      color: colors.compoundGreen
    },
  },
  title: {
    padding: '24px',
    paddingBottom: '0px',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '24px'
    }
  },
  icon: {
    fontSize: '60px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '100px',
    }
  },
  link: {
    textDecoration: 'none'
  }
});

class Home extends Component {

  constructor(props) {
    super()

    this.state = {
    }
  }

  render() {
    const { classes, t } = this.props;

    return (
      <div className={ classes.root }>
        <Card className={ `${classes.card} ${classes.earn}` } onClick={ () => { this.nav('/earn') } }>
          <AttachMoneyIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h1'} className={ `${classes.title} title` }>{ t("Home.Earn") }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.zap}` } onClick={ () => { /*this.nav('/zap')*/ } }>
          <FlashOnIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h1'} className={ `${classes.title} title` }>{ t("Home.Zap") }</Typography>
          <Typography variant={'h1'} className={ `${classes.title} title soon` }>Disabled</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.apr}` } onClick={ () => { this.nav('/apr') } }>
          <BarChartIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h1'} className={ `${classes.title} title` }>{ t("Home.Apr") }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.cover}` } onClick={ () => { this.nav('/cover') }}>
          <SecurityIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h1'} className={ `${classes.title} title` }>{ t("Home.Cover") }</Typography>
        </Card>
      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Home)));
