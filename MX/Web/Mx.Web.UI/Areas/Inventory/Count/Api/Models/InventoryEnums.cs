namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    /// <remarks>This must numerically match the StockCountType enum in the service layer and database StockCountId</remarks>
    public enum CountType
    {
        Spot = 0,
        Daily = 1,
        Weekly = 2,
        Periodic = 3,
        Monthly = 4
    }

    public enum CountStatus
    {
        NotCounted = 0,
        Pending = 1,
        Variance = 2,
        Partial = 3,
        Counted = 4
    }

    public enum TravelPathActionType
    {
        Sort = 1,
        Move = 2,
        Copy = 3,
        Delete = 4,
        Add = 5
    }

    public enum TravlePathLocation
    {
        SystemDefault = 1,
        SystemNewItem = 2,
        User = 3

    }

    public enum TravelPathCountUpdateMode
    {
        Frequency = 0,
        UnitOfMeasure = 1
    }
}