/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from "react";
import NavigationContainer from "../../containers/NavigationContainer";
//import DrawerContainer from "../../containers/DrawerContainer";


export default class HomePage extends React.PureComponent {
  componentDidMount() {
    console.log('home did load');
  }

  render() {
    return (
      <div>
        <NavigationContainer />
        {this.props.children}
      </div>
    );
  }
}
