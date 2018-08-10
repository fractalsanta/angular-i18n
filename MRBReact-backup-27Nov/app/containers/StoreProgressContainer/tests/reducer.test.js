
import { fromJS } from 'immutable';
import storeProgressContainerReducer from '../reducer';

describe('storeProgressContainerReducer', () => {
  it('returns the initial state', () => {
    expect(storeProgressContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
