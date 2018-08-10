
import { fromJS } from 'immutable';
import feedbackGroupsContainerReducer from '../reducer';

describe('feedbackGroupsContainerReducer', () => {
  it('returns the initial state', () => {
    expect(feedbackGroupsContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
