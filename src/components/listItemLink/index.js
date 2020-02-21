import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const ListItemLink = props => {
  const { icon, title, path } = props.link

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={path} {...linkProps} />
      )),
    [path]
  )

  return (
    <li>
      <ListItem selected button component={renderLink}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    </li>
  )
}

export default withRouter(ListItemLink);

