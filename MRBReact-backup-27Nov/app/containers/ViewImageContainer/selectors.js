import { createSelector } from "reselect";

/**
 * Direct selector to the viewImageContainer state domain
 */
const selectViewImageContainerDomain = () => state =>
  state.get("viewImageContainer");

/**
 * Other specific selectors
 */
const selectImage = () => (state, props) => {
  return props.params.image;
};
/**
 * Default selector used by ViewImageContainer
 */
const getImageDetails = (substate, image) => {
  return Object.assign(substate.toJS(), { image });
};

const makeSelectViewImageContainer = () =>
  createSelector(
    selectViewImageContainerDomain(),
    selectImage(),
    getImageDetails
  );

export default makeSelectViewImageContainer;
export { selectViewImageContainerDomain };
