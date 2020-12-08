import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button
} from '@material-ui/core';
import { colors } from '../../theme'

import {
} from '../../constants'

import NewCover from './newCover'
import ExistingCover from './existingCover'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  coverContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    lineHeight: '1.2',
    background: colors.white,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  headerButton: {
    width: '175px'
  }
});

class Cover extends Component {

  constructor() {
    super()

    this.state = {
      screen: 'existingCover'
    }
  }

  render() {
    const { classes } = this.props
    const { screen } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.coverContainer }>
          <div className={ classes.header }>
            { screen === 'newCover' && <Button
              onClick={ this.backClicked }
              variant='outlined'
              color='primary'
              className={ classes.headerButton }
            >Back</Button> }
            { screen !== 'newCover' && <div className={ classes.headerButton }></div> }
            <Typography variant={'h5'} className={ classes.disclaimer }>This project is in beta. Use at your own risk.</Typography>
            {screen === 'existingCover' && <Button
              onClick={ this.addClicked }
              variant='contained'
              color='primary'
              className={ classes.headerButton }
            >Buy Coverage</Button> }
            { screen !== 'existingCover' && <div className={ classes.headerButton }></div> }
          </div>
          { screen === 'existingCover' && <ExistingCover /> }
          { screen === 'newCover' && <NewCover /> }
        </div>
      </div>
    )
  };

  addClicked = () => {
    this.setState({ screen: 'newCover' })
  }

  backClicked = () => {
    this.setState({ screen: 'existingCover' })
  }
}

export default withStyles(styles)(Cover);
