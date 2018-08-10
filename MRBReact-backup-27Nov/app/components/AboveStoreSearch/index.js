/**
*
* AboveStoreSearch
*
*/

import React from "react";
import { ListGroup, ListGroupItem, Button, Checkbox } from "react-bootstrap";
import { echoSelectFactory } from "echo-component-library/EchoSelect";
// import styled from 'styled-components';

let EchoSelect = echoSelectFactory.getClass();

const noop = () => {};

function AboveStoreSearch({
  storesWithActivePages,
  toggleCriteriaCompleted,
  completed,
  displaySelectedDocuments,
  pageTitles,
  changeCriteriaPageTitle,
  pageTitle
}) {
  if (pageTitles.find(page => page.title === "Page Title") === undefined) {
    pageTitles.unshift({ title: "Page Title" });
  }
  const storeCountNodes = storesWithActivePages
    .filter(l => l.activePages.length)
    .map(l => (
      <ListGroupItem
        key={l.sys_id}
        onClick={() => displaySelectedDocuments(l.activePages)}
      >
        {l.name} - {l.activePages.length}
      </ListGroupItem>
    ));
  const selectedOption =
    pageTitles[pageTitles.findIndex(page => page.title === pageTitle)];
  return (
    <div>
      Above store search
      <br />
      Above store search
      <br />
      Above store search
      <br />
      Above store search
      <br />
      <br />
      <EchoSelect
        selectorLabel="simple"
        options={pageTitles}
        selectedOptions={[selectedOption]}
        showCategories={false}
        displayBinding="title"
        valueBinding="title"
        onSelection={aaa => changeCriteriaPageTitle(aaa.title)}
      />
      <input
        style={{ position: "inherit" }}
        type="checkbox"
        checked={completed}
        onChange={() => toggleCriteriaCompleted()}
      />
      Incomplete only
      <br />
      <ListGroup>{storeCountNodes}</ListGroup>
    </div>
  );
}

AboveStoreSearch.propTypes = {
  storesWithActivePages: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      sys_id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      activePages: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          title: React.PropTypes.string.isRequired,
          number: React.PropTypes.string.isRequired,
        })
      )
    })
  ),
  toggleCriteriaCompleted: React.PropTypes.func.isRequired,
  completed: React.PropTypes.bool.isRequired,
  displaySelectedDocuments: React.PropTypes.func.isRequired,
  pageTitles: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      title: React.PropTypes.string.isRequired
    })
  ),
  changeCriteriaPageTitle: React.PropTypes.func.isRequired,
  pageTitle: React.PropTypes.string.isRequired
};

export default AboveStoreSearch;
