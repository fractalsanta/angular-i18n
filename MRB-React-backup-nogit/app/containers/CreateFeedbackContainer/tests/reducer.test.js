
import { fromJS } from 'immutable';
import createFeedbackContainerReducer from '../reducer';

describe('createFeedbackContainerReducer', () => {
  it('returns the initial state', () => {
    expect(createFeedbackContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
