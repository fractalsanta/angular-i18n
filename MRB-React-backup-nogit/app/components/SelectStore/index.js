/**
*
* SelectStore
*
*/

import React from 'react';
import { echoTreeFactory } from 'echo-component-library/EchoTree';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

const EchoTree = echoTreeFactory.getClass();



const collection = [
  {
    label: 'nav one',
    numOfItems: 100,
    isActive: false,
    onClick: (item) => {
      if (item) {
        item.isActive = !item.isActive;
      }
    },
    children: [
      {
        label: 'sub nav one',
        numOfItems: 50,
      },
      {
        label: 'sub nav two',
        numOfItems: 50,
        children: [
          {
            label: 'deep nav one',
            numOfItems: 20,
          },
          {
            label: 'deep nav two',
            numOfItems: 30,
          }
        ]
      }
    ]
  },
  {
    label: 'this is a longer destination name',
    numOfItems: 30,
    children: [
      {
        label: 'child with action',
        numOfItems: 10,
        onClick: function () { alert('I have two actions.') },
        action: {
          icon: {
            name: "ico-plus",
            scale: 1.3,
            color: "$dark-blue"
          },
          onClick: () => { alert('perform action') }
        }
      },
      {
        label: 'child two',
        numOfItems: 20,
        children: [
          {
            label: 'sub child',
            numOfItems: 10,
          },
          {
            label: 'sub child',
            numOfItems: 10,
          }
        ]
      }
    ]
  }
];
function SelectStore({ stores, setCurrentStoreId }) {
    const storeNodes = stores.map(store => {
            return {
                label: store.name,
                onClick: () => {
                setCurrentStoreId(store.sys_id)
            }
    }
  });

    var appBarStyle = {
        backgroundColor: "rgb(12, 162, 208)",
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        clear: "both",
        alignItems: "center",
        height:"60",
    };


  return (
    <div>
      <AppBar
          title="Select Store"
          showMenuIconButton={false}
          style={appBarStyle}
        />

        <EchoTree collection={storeNodes} />

    </div>
  );
}

SelectStore.propTypes = {

};

export default SelectStore;
