
import { fromJS } from 'immutable';
import dataContainerReducer from '../reducer';

describe('dataContainerReducer', () => {
  it('returns the initial state', () => {
    expect(dataContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
