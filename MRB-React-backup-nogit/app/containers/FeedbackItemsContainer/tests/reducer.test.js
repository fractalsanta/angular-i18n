
import { fromJS } from 'immutable';
import feedbackItemsContainerReducer from '../reducer';

describe('feedbackItemsContainerReducer', () => {
  it('returns the initial state', () => {
    expect(feedbackItemsContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
