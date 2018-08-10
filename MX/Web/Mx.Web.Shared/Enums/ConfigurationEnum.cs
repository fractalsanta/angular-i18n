namespace Mx.Web.Shared.Enums
{
    // ReSharper disable InconsistentNaming
    public enum ConfigurationEnum
    {
        
        #region "(80000-80500) -  Inventory Count"
        // <summary>
        // Determines whether to show the default current date/time in the Inventory Count Finish dialog or force the user to explicitly select a date/time value.
        // 
        // Type: Boolean
        // </summary>
        Inventory_Counts_EnableForceCountSelectDateTime = 80010,
        #endregion
        
        
        #region "(91000-91500) -  System Setup"

        Core_SystemSetup_UseFederationIDForSSO = 91000

        #endregion
    }
    // ReSharper restore InconsistentNaming
}
