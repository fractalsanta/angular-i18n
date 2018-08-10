
import { fromJS } from 'immutable';
import authenticateContainerReducer from '../reducer';

describe('authenticateContainerReducer', () => {
  it('returns the initial state', () => {
    expect(authenticateContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
