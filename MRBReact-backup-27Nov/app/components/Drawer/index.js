/**
*
* Drawer
*
*/

import React from 'react';
// import styled from 'styled-components';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


class DrawerFunction extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
 return (
 <div >
 <RaisedButton
 label="Toggle Drawer"
 onClick = {toggleDrawer()}
 />
 this is a test

 </div>
 );
  }
}

DrawerFunction.propTypes = {};

export default DrawerFunction;
