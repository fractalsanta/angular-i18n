import React from "react";

import { echoIconFactory } from "echo-component-library/EchoIcon";
import { echoCheckboxFactory } from 'echo-component-library/EchoCheckbox';

import './styles.css';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Background from '../../assets/images/nav-default-logo.png';

import {List, ListItem} from 'material-ui/List';
import SvgIcon from 'material-ui/SvgIcon';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import {white} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// import styled from 'styled-components';
let EchoIcon = echoIconFactory.getClass();
let EchoCheckbox =  echoCheckboxFactory.getClass();

var appBarStyle = {
    backgroundColor: "rgb(12, 162, 208)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    clear: "both",
    alignItems: "center",
    height:"60",
    padding: "0 16px",
};

var listHeaderStyle = {
    color: "rgba(0,0,0,0.54)",
    fontWeight: "500",
    letterSpacing: ".01em",
    lineHeight: "1.2em",
    fontSize: "13px",
};

var listItemStyle = {
    backgroundColor: "rgb(12, 162, 208)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    clear: "both",
};

const SearchIcon = () => (
    <SvgIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" color="#ffffff"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
    </SvgIcon>
);


function StorePages({ selectedDocuments, viewImage, isDrawerOpen, toggleDrawer }) {
    console.log(selectedDocuments);
  let aa;
  const theList = selectedDocuments.map(i => {
    const items = [];
    const showDate = aa !== i.date;
    aa = i.date;

    var thisDate = new Date(aa);
    var formattedDate = thisDate.toLocaleDateString("en-US",{month:"long", day:"2-digit", year:"numeric"});
    if (showDate) {
      return (
        <div>
          <ListItem style={listHeaderStyle} key={i.date}>{formattedDate}</ListItem >
          <Divider />
              <ListItem
                key={i.number}
                onClick={() => {
                  viewImage(i.content_url);
                }}
                leftIcon={<Checkbox iconStyle={{opacity:".4"}} />}
                primaryText={i.title}
                secondaryText="--"
                style={{verticalAlign: "middle" }}
                insetChildren={false}
                rightIconButton={<MoreVertIcon style={{opacity:".3", top: "20"}} />}
              >
              </ListItem >
          <Divider />
        </div>
      );
    } else {
      return (
          <div>
            <ListItem
              key={i.number}
              onClick={() => {
                viewImage(i.content_url);
              }}
              style={{verticalAlign: "middle"}}
              leftIcon={<Checkbox iconStyle={{opacity:".4"}} />}
              primaryText={i.title}
              secondaryText="--"
              rightIconButton={<MoreVertIcon style={{opacity:".3", top: "20"}} />}
            >
            </ListItem >
            <Divider />
          </div>
      );
    }
  });
  return (
    <div>

      <AppBar
        title={ <img src={require(`../../assets/images/nav-default-logo.png`)} height="38" />}
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        onLeftIconButtonTouchTap={toggleDrawer}
        style={appBarStyle}
        className='appBarStyle'
        iconElementRight={<SearchIcon />}
        iconStyleRight={{opacity: ".7", margin: "5px -5px 0 auto"}}
        iconStyleLeft={{opacity: ".7"}}
        />
      <List style={{position: "absolute", padding: "8px 16px", top: "60px", width:"100%"}}>{theList}</List>
      <br />
    </div>
  );
}

StorePages.propTypes = {
    toggleDrawer: React.PropTypes.func.isRequired,
};

export default StorePages;
