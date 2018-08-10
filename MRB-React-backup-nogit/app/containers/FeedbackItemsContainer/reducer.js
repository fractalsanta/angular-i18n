/*
 *
 * FeedbackItemsContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
  FETCH_FEEDBACK_ITEMS_SUCCESS
} from './constants';

const initialState = fromJS({
});

function feedbackItemsContainerReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default feedbackItemsContainerReducer;
