
import { fromJS } from 'immutable';
import viewImageContainerReducer from '../reducer';

describe('viewImageContainerReducer', () => {
  it('returns the initial state', () => {
    expect(viewImageContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
