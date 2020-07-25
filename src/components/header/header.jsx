import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    display: 'flex',
  },
  earn: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.pink,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.pink
      },
      '& .titleActive': {
        color: colors.pink,
        borderBottom: '4px solid '+colors.pink,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.pink
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    },
  },
  zap: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.lightBlue,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.lightBlue,
      },
      '& .titleActive': {
        color: colors.lightBlue,
        borderBottom: '4px solid '+colors.lightBlue,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.lightBlue
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    },
  },
  apr: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.lightBlack,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.lightBlack
      },
      '& .titleActive': {
        color: colors.lightBlack,
        borderBottom: '4px solid '+colors.lightBlack,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.lightBlack
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    }
  },
  cover: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.compoundGreen,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.compoundGreen
      },
      '& .titleActive': {
        color: colors.compoundGreen,
        borderBottom: '4px solid '+colors.compoundGreen,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.compoundGreen
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    }
  },
  pool: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.tomato,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.tomato
      },
      '& .titleActive': {
        color: colors.tomato,
        borderBottom: '4px solid '+colors.tomato,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.tomato
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    }
  },
});

function Header(props) {
  const {
    classes,
    headerValue
  } = props;

  const nav = (screen) => {
    props.history.push('/'+screen)
  }

  return (
    <div className={ classes.root }>
      <div className={ `${classes.earn}` } onClick={ () => { nav('earn') } }>
        <Typography variant={'h3'} className={ headerValue===0?`titleActive`:`title` }>Earn</Typography>
      </div>
      <div className={ `${classes.zap}` } onClick={ () => { nav('zap') } }>
        <Typography variant={'h3'} className={ headerValue===1?`titleActive`:`title` }>Zap</Typography>
      </div>
      <div className={ `${classes.apr}` } onClick={ () => { nav('apr') } }>
        <Typography variant={'h3'} className={ headerValue===2?`titleActive`:`title` }>APR</Typography>
      </div>
      <div className={ `${classes.pool}` } onClick={ () => { nav('vaults') } }>
        <Typography variant={'h3'} className={ headerValue===4?`titleActive`:`title` }>Vaults</Typography>
      </div>
    </div>
  )
}

export default withRouter(withStyles(styles)(Header));
