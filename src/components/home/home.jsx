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
import WarningIcon from '@material-ui/icons/Warning';

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
  experimental: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.orange,
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
      color: colors.orange,
    },
    '& .icon': {
      color: colors.orange
    },
    '& .description': {
      display: 'none'
    }
  },
  lending: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.creamBlue,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.creamBlue,
        backgroundImage: `url(${require('../../assets/cream-icon-hover.svg')})`,
      },
      '& .description': {
        display: 'block',
        color: colors.white,
        padding: '48px',
        textAlign: 'center'
      }
    },
    '& .title': {
      color: colors.creamBlue,
    },
    '& .icon': {
      color: colors.creamBlue,
      backgroundImage: `url(${require('../../assets/cream-icon.svg')})`,
      backgroundSize: '100px 100px',
      height: '100px',
      width: '100px'      
    },
    '& .description': {
      display: 'none'
    }
  },
  cover: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.coverPurple,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        backgroundImage: `url(${require('../../assets/cover-icon-hover.png')})`
      },
      '& .description': {
        display: 'block',
        color: colors.white,
        padding: '48px',
        textAlign: 'center'
      }
    },
    '& .title': {
      color: colors.coverPurple,
    },
    '& .icon': {
      color: colors.coverPurple,
      height: '100px',
      width: '100px',
      backgroundImage: `url(${require('../../assets/cover-icon.png')})`,
      backgroundSize: '100px 100px'
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
    const { classes, t } = this.props;

    return (
      <div className={ classes.root }>
        <Card className={ `${classes.card} ${classes.apr}` } onClick={ () => { this.nav('dashboard') } }>
          <BarChartIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Dashboard</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Get a quick glance at how your portfolio is growing while invested in yearn's products." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.vault}` } onClick={ () => { this.nav('vaults') }}>
          <PieChartIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Vaults") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Vaults follow unique strategies that are designed to maximize the yield of the deposited asset and minimize risk." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.earn}` } onClick={ () => { this.nav('earn') } }>
          <AttachMoneyIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Earn") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Earn performs profit switching for lending providers, moving your funds between dydx, Aave, Compound autonomously." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.zap}` } onClick={ () => { this.nav('zap') } }>
          <FlashOnIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Zap") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Zaps help you save on gas fees. Zap directly into or out of Curve pools from the base assets." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.experimental}` } onClick={ () => { this.nav('experimental') } }>
          <WarningIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Experimental") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Home for experimental vaults." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.lending}` } onClick={ () => { this.nav('lending') } }>
          <div alt='' className={ `${classes.icon} icon cream` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Lending") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Lending, provided by cream." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.cover}` } onClick={ () => { this.nav('cover') } }>
          <div alt='' className={ `${classes.icon} icon cover` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>{ t("Home.Cover") }</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Cover provided by Cover Protocol." }</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.apr}` } onClick={ () => { this.nav('stats') } }>
          <BarChartIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Stats</Typography>
          <Typography variant={'h4'} className={ `${classes.description} description` }>{ "Get a quick glance at how yearn's vaults are performing." }</Typography>
        </Card>
      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Home)));
