/**
*
* FeedbackItems
*
*/

import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
// import styled from 'styled-components';

function FeedbackItems({ feedbackItems, feedbackTitle }) {
  const feedbackItemsNodes = feedbackItems.map(l => (
    <ListGroupItem
      key={l.sys_id}
      onClick={() => console.log('yo')}
    >
      {l.sys_created_at}
      <br/>
      {l.sys_created_by}
      <br/>
      {l.feedback}
    </ListGroupItem>
  ));
  return (
    <div>
      Feedback items
      <br />
      Feedback items
      <br />
      Feedback items
      <br />
      Feedback items
      <br />
      Feedback items
      <br />
      {feedbackTitle}
      <br />
      <ListGroup>{feedbackItemsNodes}</ListGroup>
    </div>
  );
}

FeedbackItems.propTypes = {
  feedbackItems: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      sys_id: React.PropTypes.string.isRequired,
      sys_created_at: React.PropTypes.string.isRequired,
      sys_created_by: React.PropTypes.string.isRequired,
      feedback: React.PropTypes.string.isRequired
    })
  )
};

export default FeedbackItems;
