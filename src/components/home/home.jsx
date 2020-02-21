import { Card, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BarChartIcon from '@material-ui/icons/BarChart';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import SecurityIcon from '@material-ui/icons/Security';
import React, { Component } from "react";
import { withNamespaces } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme';
import AppLayout from '../appLayout';

const styles = theme => ({
  cardsContainer: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexWrap: 'wrap',
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
    [theme.breakpoints.up('md')]: {
      height: '100vh',
      width: '100%'
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
        color: colors.white
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.blue
    },
    '& .icon': {
      color: colors.blue
    }
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
    }
  },
  cover: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.compoundGreen,
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
      color: colors.compoundGreen,
      display: 'block'
    },
    '& .soon': {
      color: colors.compoundGreen,
      display: 'none'
    },
    '& .icon': {
      color: colors.compoundGreen
    }
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
      fontSize: '100px'
    }
  },
  link: {
    textDecoration: 'none'
  }
})

class Home extends Component {

  constructor(props) {
    super()

    this.state = {
    }
  }

  render() {
    console.log(this.props)
    const { classes, t } = this.props;
    const {
      account,
    } = this.state

    return (
      <AppLayout>
        <div className={classes.cardsContainer}>
          <Card className={ `${classes.card} ${classes.earn}` } onClick={ () => { this.nav('/earn') } }>
            <AttachMoneyIcon className={ `${classes.icon} icon` } />
            <Typography variant={'h1'} className={ `${classes.title} title` }>Earn</Typography>
          </Card>
          <Card className={ `${classes.card} ${classes.zap}` } onClick={ () => { this.nav('/zap') } }>
            <FlashOnIcon className={ `${classes.icon} icon` } />
            <Typography variant={'h1'} className={ `${classes.title} title` }>Zap</Typography>
          </Card>
          <Card className={ `${classes.card} ${classes.apr}` } onClick={ () => { this.nav('/apr') } }>
            <BarChartIcon className={ `${classes.icon} icon` } />
            <Typography variant={'h1'} className={ `${classes.title} title` }>APR</Typography>
          </Card>
          <Card className={ `${classes.card} ${classes.cover}` } onClick={ () => { /*this.nav('/cover')  */}}>
            <SecurityIcon className={ `${classes.icon} icon` } />
            <Typography variant={'h1'} className={ `${classes.title} title` }>Cover</Typography>
            <Typography variant={'h1'} className={ `${classes.title} title soon` }>Coming soon</Typography>
          </Card>
        </div>
      </AppLayout>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Home)));
