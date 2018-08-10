
import { fromJS } from 'immutable';
import drawerContainerReducer from '../reducer';

describe('drawerContainerReducer', () => {
  it('returns the initial state', () => {
    expect(drawerContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
