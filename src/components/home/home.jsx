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
import BarChartIcon from '@material-ui/icons/BarChart';
import PieChartIcon from '@material-ui/icons/PieChart';
import SecurityIcon from '@material-ui/icons/Security';

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
      },
      '& .description': {
        display: 'block',
        color: colors.white,
        padding: '48px',
        textAlign: 'center'
      }
    },
    '& .title': {
      color: colors.pink
    },
    '& .icon': {
      color: colors.pink
    },
    '& .description': {
      display: 'none'
    }
  },
  zap: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.blue,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      },
      '& .description': {
        display: 'block',
        color: colors.white,
        padding: '48px',
        textAlign: 'center'
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
    '& .description': {
      display: 'none'
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
      },
      '& .description': {
        display: 'block',
        color: colors.white,
        padding: '48px',
        textAlign: 'center'
      }
    },
    '& .title': {
      color: colors.lightBlack
    },
    '& .icon': {
      color: colors.lightBlack
    },
    '& .description': {
      display: 'none'
    }
  },
  vault: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.tomato,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      },
      '& .description': {
        display: 'block',
        color: colors.white,
        padding: '48px',
        textAlign: 'center'
      }
    },
    '& .title': {
      color: colors.tomato,
    },
    '& .icon': {
      color: colors.tomato
    },
    '& .description': {
      display: 'none'
    }
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
      },
      '& .description': {
        display: 'block',
        color: colors.white,
        padding: '48px',
        textAlign: 'center'
      }
    },
    '& .title': {
      color: colors.compoundGreen,
    },
    '& .icon': {
      color: colors.compoundGreen
    },
    '& .description': {
      display: 'none'
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
    const { classes, t, location } = this.props;

    return (
      <div className={ classes.root }>
        <Card className={ `${classes.card} ${classes.apr}` } onClick={ () => { this.nav(location.pathname+'dashboard') } }>
          <BarChartIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Dashboard</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Get a quick glance at how your portfolio is growing while invested in yearn's products." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.vault}` } onClick={ () => { this.nav(location.pathname+'vaults') }}>
          <PieChartIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Vaults") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Vaults follow a unique strategy that are designed to maximize the yield of the deposited asset and minimize risk." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.earn}` } onClick={ () => { this.nav(location.pathname+'earn') } }>
          <AttachMoneyIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Earn") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Earn performs profit switching for lending providers, moving your funds between dydx, Aave, Compound autonomously." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.zap}` } onClick={ () => { this.nav(location.pathname+'zap') } }>
          <FlashOnIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Zap") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Zaps help you save on gas fees. Zap directly into or out of Curve pools from the base assets." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.cover}` } onClick={ () => { window.open("https://yinsure.finance", "_blank") } }>
          <SecurityIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Cover") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Get cover with Nexus Mutual from yinsure.finance" }</Typography>
        </Card>
      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Home)));
