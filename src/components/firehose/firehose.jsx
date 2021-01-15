import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Store from "../../stores";
import { FIREHOSE_STATE_UPDATED } from "../../constants";
import moment from "moment";
const emitter = Store.emitter;

moment.relativeTimeThreshold("ss", "unset");

const styles = (theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "1200px",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  firehoseContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minWidth: "100%",
    marginTop: "40px",
    [theme.breakpoints.up("md")]: {
      minWidth: "900px",
    },
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  item: {
    display: "block",
  },
  column: {
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  timer: {
    whiteSpace: "nowrap",
  },
});

class Firehose extends Component {
  constructor() {
    super();
    this.state = {
      firehose: {},
      currentDate: Date.now(),
    };
    this.firehoseStateUpdated = this.firehoseStateUpdated.bind(this);

    setInterval(() => this.setState({ currentDate: Date.now() }), 1000);
  }

  firehoseStateUpdated(data) {
    const firehoseState = this.state.firehose;
    data.forEach((item) => {
      const { topic } = item;
      firehoseState[topic] = item;
    });
    this.setState({
      firehose: firehoseState,
    });
  }

  componentWillMount() {
    emitter.on(FIREHOSE_STATE_UPDATED, this.firehoseStateUpdated);
  }

  componentWillUnmount() {
    emitter.removeListener(FIREHOSE_STATE_UPDATED, this.firehoseStateUpdated);
  }

  render() {
    const { classes } = this.props;
    const { firehose } = this.state;

    const renderItem = (item, idx) => {
      const { classes } = this.props;
      const { address, method, args, updated, value } = item;
      return (
        <tr key={idx}>
          <td>{address}</td>
          <td>
            <div className={classes.timer}>
              {moment(updated * 1000).from(this.currentDate)}
            </div>
          </td>
          <td>{method}</td>
          <td>
            <div className={classes.column}>{args}</div>
          </td>
          <td>
            <div className={classes.column}>{JSON.stringify(value)}</div>
          </td>
        </tr>
      );
    };

    const firehoseItems = Object.values(firehose)
      .sort(function (a, b) {
        return b.updated - a.updated;
      })
      .map(renderItem);

    return (
      <div className={classes.root}>
        <div className={classes.firehoseContainer}>
          <div className={classes.wrapper}>
            <h3>Firehose Load Limit Test</h3>
            <table className={classes.firehoseItems}>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Updated</th>
                  <th>Method</th>
                  <th>Args</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>{firehoseItems}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Firehose);
