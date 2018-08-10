/**
*
* StoreProgress
*
*/

import React from "react";
// import styled from 'styled-components';
import { echoDatePickerFactory } from "echo-component-library/EchoDatePicker";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import BusyLoading from "../../components/BusyLoading";

let EchoDatePicker = echoDatePickerFactory.getClass();

function StoreProgress({
  storesWithDetails,
  dateSelectHandler,
  modalOpen,
  selectedDate,
  selectStoreForDate,
  loadAboveStoreSearch,
  displaySelectedDocuments
}) {
  if (!storesWithDetails.length) {
    return (
      <div>
        <BusyLoading />
      </div>
    );
  }
  const storeDetailsNodes = storesWithDetails.map(l => (
    <ListGroupItem
      key={l.sys_id}
      onClick={() => {
        displaySelectedDocuments(l.activePages)
      }}
    >
      {l.name} - {l.completedPercent}%
    </ListGroupItem>
  ));
  return (
    <div>
      Store Progress
      <br />
      Store Progress
      <br />
      Store Progress
      <br />
      Store Progress
      <br />
      Store Progress
      <br />
      <EchoDatePicker onDateSelect={dateSelectHandler} value={selectedDate} />
      <Button bsStyle="primary" onClick={() => loadAboveStoreSearch()}>
        Search
      </Button>
      <ListGroup>{storeDetailsNodes}</ListGroup>
    </div>
  );
}

StoreProgress.propTypes = {};

export default StoreProgress;
