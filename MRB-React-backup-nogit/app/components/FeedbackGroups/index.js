/**
*
* FeedbackGroups
*
*/

import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
// import styled from 'styled-components';

function FeedbackGroups({ feedbackGroups,  selectFeedbackByTitle }) {
  const feedbackGroupNodes = feedbackGroups.map(l => (
    <ListGroupItem key={l._id} onClick={() => selectFeedbackByTitle(l._id)}>
      {l._id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{l.count}
    </ListGroupItem>
  ));
  return (
    <div>
      Feedback groups
      <br />
      Feedback groups
      <br />
      Feedback groups
      <br />
      Feedback groups
      <br />
      Feedback groups
      <br />
      <ListGroup>{feedbackGroupNodes}</ListGroup>
    </div>
  );
}

FeedbackGroups.propTypes = {
  feedbackGroups: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      count: React.PropTypes.number.isRequired
    })
  )
};

export default FeedbackGroups;
