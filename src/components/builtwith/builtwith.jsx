import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Store from "../../stores";
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    height: 'auto',
    display: 'flex',
    position: 'relative'
  },
  contentContainer: {
    margin: 'auto',
    textAlign: 'center',
    padding: '12px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  cardContainer: {
    marginTop: '60px',
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  unlockCard: {
    padding: '24px'
  },
  metamaskIcon: {
    backgroundImage: 'url('+require('../../assets/icn-metamask.svg')+')',
    width: '30px',
    height: '30px'
  },
  ledgerIcon: {
    backgroundImage: 'url('+require('../../assets/icn-ledger.svg')+')',
    width: '30px',
    height: '30px'
  },
  buttonText: {
    marginLeft: '12px',
    fontWeight: '700',
  },
  instruction: {
    maxWidth: '400px',
    marginBottom: '32px',
    marginTop: '32px'
  },
  metamask: {
    backgroundImage: 'url('+require('../../assets/metamask.svg')+')',
    width: '200px',
    height: '200px'
  },
  ledger: {
    backgroundImage: 'url('+require('../../assets/icn-ledger.svg')+')',
    backgroundSize: '100%',
    width: '200px',
    height: '200px'
  },
  actionButton: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '3rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  connect: {
    width: '100%'
  },
  closeIcon: {
    position: 'fixed',
    right: '12px',
    top: '12px',
    cursor: 'pointer'
  }
});

class BuildWith extends Component {

  constructor(props) {
    super()

    this.state = {}
  }

  componentWillMount() {

  };

  componentWillUnmount() {

  };

  render() {
    const { classes, closeModal } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.closeIcon } onClick={ closeModal }><CloseIcon /></div>
        <div className={ classes.contentContainer }>
          <MyComponent />
        </div>
      </div>
    )
  };
}

function MyComponent(props) {

  const builtWith = store.getStore('builtWith')

  const width = window.innerWidth

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: (width > 650 ? 'space-between' : 'center'), alignItems: 'center' }}>
      {builtWith.map(project => {

        const url = require('../../assets/'+project.logo)

        return (
          <div style={{ padding: '12px 0px', display: 'flex', justifyContent: 'space-between'  }}>
            <Button style={ {
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '1rem',

                border: '1px solid #E1E1E1',
                fontWeight: 500,
                display: 'flex',
                justifyContent: 'space-between'
              } }
              variant='outlined'
              color='primary'
              onClick={() => {
                window.open(project.website, "_blank")
              }}>
              <Typography style={ {
                  margin: '0px 12px',
                  color: 'rgb(1, 1, 1)',
                  fontWeight: 500,
                  fontSize: '1rem',
                } }
                variant={ 'h3'}>
                { project.name }
              </Typography>

              <img style={
                {
                  right: '20px',

                  width: '30px',
                  height: '30px'
                }
              } src={url} alt=""/>
            </Button>
          </div>
        )
      }) }
      </div>
  )

}



export default withRouter(withStyles(styles)(BuildWith));
