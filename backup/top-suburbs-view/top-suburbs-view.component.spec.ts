import { TopSuburbsViewComponent } from './top-suburbs-view.component';
import { IFilter, ISuburb, IAgent } from '../../models';
import * as fromStore from '../../../store';
import * as _ from 'lodash';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('Top Suburbs View component', () => {
  const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch', 'pipe']);
  const loadingCtrlSpy = jasmine.createSpyObj('LoadingController', ['create', 'dismiss']);
  let component: TopSuburbsViewComponent;

  beforeEach(() => {
    component = new TopSuburbsViewComponent(storeSpy, loadingCtrlSpy);
    component.chartData = {};
  });

  const testSuburbs: ISuburb[] = [
    {
      Name: 'First Suburb',
      ManagementType: 'Commercial',
      AgentFullName: 'Caitlin Parry',
      TDActiveProp: 555,
      TDActiveLeases: 444,
      TDVacantProp: 333
    },
    {
      Name: 'First Suburb',
      ManagementType: 'Residential',
      AgentFullName: 'Caitlin Parry',
      TDActiveProp: 2,
      TDActiveLeases: 3,
      TDVacantProp: 1
    },
    {
      Name: 'Second Suburb',
      ManagementType: 'Residential',
      AgentFullName: 'Hayden Barlow',
      TDActiveProp: 222,
      TDActiveLeases: 111,
      TDVacantProp: 99
    },
    {
      Name: 'Third Suburb',
      ManagementType: 'Residential',
      AgentFullName: 'Ning Coles',
      TDActiveProp: 999,
      TDActiveLeases: 888,
      TDVacantProp: 777
    }
  ];

  const testAgent: IAgent[] = [
    {
      UserId: '4873facb-96bc-4a05-823c-101228b032d3',
      Name: 'Caitlin Parry'
    }
  ];

  describe('@Method filterChartData', () => {
    it('should return an empty data set when the Top Suburb data is null', () => {
      const filter: IFilter = { fieldsSet: [], financialMonth: 201812, agents: [] };

      component.filterSuburbsData(filter, null);

      expect(component.chartData).toEqual({});
    });

    it('should group data by suburb', () => {
      const filter: IFilter = { fieldsSet: [], financialMonth: 201812, agents: [] };

      const result = component.filterSuburbsData(filter, testSuburbs);

      expect(result[0].Name).toBe('Third Suburb');
    });
    it('should create a data set with the sum of Active Properties grouped by name', () => {
      const filter: IFilter = { fieldsSet: [], financialMonth: 201812, agents: [] };

      const result = component.filterSuburbsData(filter, testSuburbs);

      const TDActiveProp1 = Number(testSuburbs[0].TDActiveProp);
      const TDActiveProp2 = Number(testSuburbs[1].TDActiveProp);

      expect(result[1].TDActiveProp).toBe(TDActiveProp1 + TDActiveProp2);
    });

    it('should create a data set with the sum of Active Leases grouped by name', () => {
      const filter: IFilter = { fieldsSet: [], financialMonth: 201812, agents: [] };

      const result = component.filterSuburbsData(filter, testSuburbs);

      const activeLease1 = Number(testSuburbs[0].TDActiveLeases);
      const activeLease2 = Number(testSuburbs[1].TDActiveLeases);

      expect(result[1].TDActiveLeases).toBe(activeLease1 + activeLease2);
    });

    it('should create a data set with the sum of Vacant Properties grouped by name', () => {
      const filter: IFilter = { fieldsSet: [], financialMonth: 201812, agents: [] };
      const result = component.filterSuburbsData(filter, testSuburbs);

      const vacantProp1 = Number(testSuburbs[0].TDVacantProp);
      const vacantProp2 = Number(testSuburbs[1].TDVacantProp);

      expect(result[1].TDVacantProp).toBe(vacantProp1 + vacantProp2);
    });

    it('should filter suburb data by agent if the global agent filter is set', () => {
      const filter: IFilter = { fieldsSet: [], financialMonth: 201812, agents: testAgent };
      const result = component.filterSuburbsData(filter, testSuburbs);

      const resultArr = component.suburbs;

      const nonMatchingAgents = _.find(resultArr, el => {
        return el.AgentFullName !== 'Caitlin Parry';
      });
      expect(nonMatchingAgents).toBeFalsy();
    });
  });

  describe('@Method mapChartData', () => {
    it('should return an empty data set when the Top Suburb data is null', () => {
      const filter: IFilter = { fieldsSet: [], financialMonth: 201812, agents: [] };

      component.mapChartData(testSuburbs);

      expect(component.chartData).toEqual({});
    });

    it('should return a chart series data set with Active Properties set', () => {
      const result = component.mapChartData(testSuburbs);

      expect(result.TDActiveProp.data.length).toBe(4);
    });

    it('should return a chart series data set with Active Leases set', () => {
      const result = component.mapChartData(testSuburbs);

      expect(result.TDActiveLeases.data.length).toBe(4);
    });

    it('should return a chart series data set with Vacant Properties set', () => {
      const result = component.mapChartData(testSuburbs);

      expect(result.TDVacantProp.data.length).toBe(4);
    });
  });

  describe('Loading control tests', () => {
    var loading = jasmine.createSpyObj('Loading', ['present', 'dismiss']);
    const topSuburbsFetching$ = new BehaviorSubject<Boolean>(false);

    beforeEach(() => {
      loadingCtrlSpy.create.and.returnValue(loading);

      storeSpy.select.and.callFake((selector: any) => {
        if (selector === fromStore.getTopSuburbsFetching) {
          return topSuburbsFetching$.asObservable();
        } else {
          return new EmptyObservable();
        }
      });

      loading.present.calls.reset();
      loading.dismiss.calls.reset();
    });

    it('should display the loading screen when the top suburbs data is fetching', () => {
      topSuburbsFetching$.next(false);

      component.ngOnInit();

      expect(loading.present).not.toHaveBeenCalled();

      topSuburbsFetching$.next(true);

      expect(loading.present).toHaveBeenCalled();
    });

    it('should dismiss the loading screen when the top suburbs data was fetching but has completed', () => {
      topSuburbsFetching$.next(true);

      component.ngOnInit();

      expect(loading.present).toHaveBeenCalled();

      topSuburbsFetching$.next(false);

      expect(loading.dismiss).toHaveBeenCalled();
    });
  });
});
