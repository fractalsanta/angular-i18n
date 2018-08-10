
import { fromJS } from 'immutable';
import storePagesContainerReducer from '../reducer';

describe('storePagesContainerReducer', () => {
  it('returns the initial state', () => {
    expect(storePagesContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
