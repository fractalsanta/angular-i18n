
import { fromJS } from 'immutable';
import aboveStoreSearchContainerReducer from '../reducer';

describe('aboveStoreSearchContainerReducer', () => {
  it('returns the initial state', () => {
    expect(aboveStoreSearchContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
