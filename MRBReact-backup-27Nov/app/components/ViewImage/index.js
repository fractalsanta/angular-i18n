/**
*
* ViewImage
*
*/

import React from "react";
import { Image } from "react-bootstrap";
import BusyLoading from "../../components/BusyLoading";
// import styled from 'styled-components';

function ViewImage({ image, selectedImage64 }) {
  if (!selectedImage64) {
    return (
      <div>
        view image
        <br />
        view image
        <br />
        view image
        <br />
        view image
        <br />
        <BusyLoading />
        <br />
      </div>
    );
  }
  return (
    <div>
      view image
      <br />
      view image
      <br />
      view image
      <br />
      view image
      <br />
      view image
      <br />
      <Image src={"data:image/jpeg;base64," + selectedImage64} responsive />
    </div>
  );
}

ViewImage.propTypes = {};

export default ViewImage;
