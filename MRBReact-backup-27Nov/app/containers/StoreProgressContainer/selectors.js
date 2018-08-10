import { createSelector } from "reselect";
import { makeSelectDatesAndStores } from "../DataContainer/selectors";


const selectStoreProgressContainerDomain = () => state =>
  state.get("storeProgressContainer");
const selectedDate = () => state =>
  state.getIn(["storeProgressContainer", "selectedDate"]);

const getSelectedDayDetails = (selDate, storesWithDets) => {
  const selectedStoreAndDay = storesWithDets.find(storeWithDetails => {
    return storeWithDetails.date === selDate;
  });
  if (selectedStoreAndDay) {
    return Object.assign(
      { storesWithDetails: selectedStoreAndDay.storesWithDetails },
      { selectedDate: selDate }
    );
  } else {
    return Object.assign(
      { storesWithDetails: storesWithDets },
      { selectedDate: selDate }
    );
  }
};

const selectStoreProgressContainer = () =>
  createSelector(selectedDate(), makeSelectDatesAndStores(), getSelectedDayDetails);

export default selectStoreProgressContainer;
export { selectStoreProgressContainerDomain };
