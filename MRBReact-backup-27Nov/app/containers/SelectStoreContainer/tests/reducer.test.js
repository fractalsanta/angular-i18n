
import { fromJS } from 'immutable';
import selectStoreContainerReducer from '../reducer';

describe('selectStoreContainerReducer', () => {
  it('returns the initial state', () => {
    expect(selectStoreContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
