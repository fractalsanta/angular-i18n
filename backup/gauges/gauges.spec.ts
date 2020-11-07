import { AuthService } from '../../services/auth/auth.service';
import { GaugesComponent } from './gauges';
import { ActionReducerMap, Store } from '@ngrx/store';

describe('GaugesComponent', () => {
  let component: GaugesComponent;
  const storeSpy = jasmine.createSpyObj('Store<IAppState>', ['select', 'dispatch', 'subscribe']);

  beforeEach(() => {
    component = new GaugesComponent(storeSpy);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
