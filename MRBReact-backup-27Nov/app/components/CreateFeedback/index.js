/**
*
* CreateFeedback
*
*/

import React from "react";
import { echoSelectFactory } from "echo-component-library/EchoSelect";
import { echoTextAreaFactory } from 'echo-component-library/EchoTextArea';
import { Button } from "react-bootstrap";

let EchoSelect = echoSelectFactory.getClass();
let EchoTextArea =  echoTextAreaFactory.getClass();

function CreateFeedback({ pageTitles, submitFeedback }) {
  let titleSelect = null;
  let commentsTextArea = null;
  const pageTitle = "Page Title";
  if (pageTitles.find(page => page.title === "Page Title") === undefined) {
    pageTitles.unshift({ title: "Page Title" });
  }
  const selectedOption =
    pageTitles[pageTitles.findIndex(page => page.title === pageTitle)];

  const onSubmitFeedback = () => {
    const title = titleSelect.state._selectedOptions[0].title;
    const comments = commentsTextArea.state.value;
    submitFeedback(title, comments);
    console.log(title);
    console.log(comments);
    // const feedback =
  };

  return (
    <div>
      Create feedback
      <br />
      Create feedback
      <br />
      Create feedback
      <br />
      Create feedback
      <br />
      Create feedback
      <br />
      <EchoSelect
        selectorLabel="simple"
        options={pageTitles}
        selectedOptions={[selectedOption]}
        showCategories={false}
        displayBinding="title"
        valueBinding="title"
        ref={select => {
          titleSelect = select;
        }}
      />
      <EchoTextArea
        rows={7}
        label="Comments"
        ref={textArea => {
          commentsTextArea = textArea;
        }}
      />
      <Button bsStyle="primary" onClick={onSubmitFeedback}>
        Submit feedback
      </Button>
    </div>
  );
}

CreateFeedback.propTypes = {};

export default CreateFeedback;
