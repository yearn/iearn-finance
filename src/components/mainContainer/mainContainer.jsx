import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";

const styles = theme => ({
  toolbar: {
    minHeight: '96px',
    [theme.breakpoints.down('sm')]: {
      minHeight: '73px'
    }
  }
})

class MainContainer extends Component {
  constructor(props) {
    super()
  }

  render() {
    const { 
      classes
    } = this.props;

    return (
      <div className={classes.toolbar} />
    );
  }
}

export default withRouter(withStyles(styles)(MainContainer));