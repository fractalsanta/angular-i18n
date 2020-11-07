import { OverviewComponent } from './overview';

describe('OverviewComponent', () => {
  let component: OverviewComponent;

  beforeEach(() => {
    component = new OverviewComponent();
    component.monthData = {
      TDActiveProp: 12,
      ActiveProp: 34,
      TDActiveLeases: 45,
      TDVacantProp: 67,
      TDTenancyInArrearsCount: 78,
      TDActiveTenancies: 89,
      TDTenancyArrearsAmount: 123456,
      TDTenancyInArrearsPercentage: 23,
      TDVacantPropPercentage: 34,
      MTDNetGainedLostMgmts: 45,
      MTDLostMgmts: 56,
      MTDGainedNonTenantedMgmts: 67,
      MTDGainedTenantedMgmts: 78
    };
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('@Method: formatToCurrency', () => {
    it('should convert a number to a currency', () => {
      component.formatToCurrency(component.monthData.TDTenancyArrearsAmount);
      expect(component.tenancyArrearsAmt).toEqual('$123,456.00');
    });
  });
});
