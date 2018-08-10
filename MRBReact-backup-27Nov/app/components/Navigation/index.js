/**
*
* Navigation
*
*/

import React from "react";
import { logout } from "../../services/AuthenticationService";
import { put } from "redux-saga/effects";
import { push } from "react-router-redux";
import './styles.css';
// import styled from 'styled-components';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import MapsAddLocation from 'material-ui/svg-icons/maps/add-location';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Person from 'material-ui/svg-icons/social/person';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


const iconStyle = {
  backgroundColor: "#d8d8d8",
  height: "32px",
  width: "32px",
  borderRadius: "16px",
  padding: "2px",
}
const accountItems = [
  {
    label: "My Account",
    icon: {
      name: "ico-human",
      color: "$dark-gray"
    }
  },
  {
    label: "Settings",
    icon: {
      name: "ico-settings",
      color: "$dark-gray"
    }
  },
  {
    label: "Add Module",
    template: "section-break",
    icon: {
      name: "ico-help-filled"
    },
    onClick: () => {
      alert("get help...");
    }
  },
  {
    label: "Production",
    action: {
      icon: {
        name: "ico-plus"
      },
      onClick: () => {
        alert("add module...");
      }
    }
  },
  {
    label: "Recipe",
    action: {
      icon: {
        name: "ico-plus"
      },
      onClick: () => {
        alert("add module...");
      }
    }
  },
  {
    label: "Vendors",
    action: {
      icon: {
        name: "ico-plus"
      },
      onClick: () => {
        alert("add module...");
      }
    }
  }
];

function Navigation({ toggleDrawer, isDrawerOpen, isSelectStoreDrawerOpen, navigateToFeedback, navigateToCreateFeedback, sendItemsInPostQueue, navigateToStores }) {

  const navItems = [
    {
      label: "Feedback",
      onClick: () => {
        toggleDrawer();
        navigateToFeedback();
      }
    },
    {
      label: "Create Feedback",
      onClick: () => {
        toggleDrawer();
        navigateToCreateFeedback();
      }
    },
    {
      label: "Flush queue",
      onClick: () => {
        sendItemsInPostQueue();
      }
    },
    {
      label: "Test",
      onClick: () => {
        var options = {
          destinationType: camera.DestinationType.DATA_URL,
          quality: 70,
          encodingType: camera.EncodingType.JPEG,
          saveToPhotoAlbum: false,
          allowEdit: false
        };
        camera.capturePhoto(options)
          .then(function (imageInfo) {
            console.log(imageInfo);
          });
      }
    },
    {
      label: "Logout",
      onClick: () => {
        logout();
      }
    },
    {
      label: "Staff",
      children: [
        {
          label: "Staff List"
        },
        {
          label: "Staff List",
          children: [
            {
              label: "Staff Cert"
            },
            {
              label: "Staff Journal"
            }
          ]
        }
      ]
    }
  ];
  const menuNavItems = [
    {
      label: "Drawer",
      isActive: true,
      onClick: () => {
        toggleDrawer();
      }
    }
  ];
  const navigateAndToggle = function() {
      navigateToStores();
      toggleDrawer();
  }

  return (
      <div>
      <Drawer open={isDrawerOpen} docked={false} containerStyle={isDrawerOpen ? {width: 'calc(100% - 56px)', maxWidth: "400px"} : ''}  overlayClassName={"drawerOverlay"} onRequestChange={toggleDrawer} >

          <List style={{backgroundColor:"#f4f4f4", paddingTop:"0"}}>
            <ListItem primaryText="Conan Doyle" secondaryText="mrbnew01" leftIcon={<Person style={iconStyle} />} />
            <FlatButton label="MRB Content Feedback" fullWidth={true} style={{textAlign:"left"}} labelStyle={{textTransform: "none"}} primary={true} />
            <FlatButton label="Help" fullWidth={true} style={{textAlign:"left"}} labelStyle={{textTransform: "none"}} primary={true} />
            <FlatButton label="Log Out" fullWidth={true} style={{textAlign:"left"}} labelStyle={{textTransform: "none"}} primary={true} />
          </List>
          <List style={isSelectStoreDrawerOpen ? {display: 'none'} : ''}>
            <ListItem primaryText="Ah' Pizz - Montclair" leftIcon={<MapsAddLocation style={iconStyle}/>} />
          </List>
          <List style={{padding:"8px"}}>
            <RaisedButton label="Change Store" onClick={navigateAndToggle} buttonStyle={{height:"56px"}} fullWidth={true} labelPosition="before" icon={<NavigationArrowForward />} iconStyle={{color:"red"}} labelStyle={{color: "#fff", fontWeight: 600, textTransform: "none"}} backgroundColor={"rgb(3,155,229)"} />
          </List>


      </Drawer>
      </div>
  );
}

Navigation.propTypes = {
    toggleDrawer: React.PropTypes.func.isRequired,
    toggleSelectStore: React.PropTypes.func.isRequired,
    navigateToStores: React.PropTypes.func.isRequired,
};

export default Navigation;
