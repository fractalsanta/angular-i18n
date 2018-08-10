using System;
using System.Collections.Generic;
using Elmah;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using Mx.Web.UI.Config;

namespace Mx.Web.UI.Areas
{
    public class ApplicationHub : BaseHub<ApplicationHub>
    {

        public static void CountDeleted(long entityId, string connectionId, long countId, string name)
        {
            try
            {
                Group(entityId, connectionId).CountDeleted(countId, name);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void CountStateChanged(long entityId)
        {
            try
            {
                Group(entityId).CountStateChanged();
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void CountSubmitted(long entityId, string connectionId, long countId, string name)
        {
            try
            {
                Group(entityId, connectionId).CountSubmitted(countId, name);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void ForecastGenerationFailed(long entityId, string message)
        {
            try
            {
                Group(entityId).ForecastGenerationFailed(message);

            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void ForecastHasBeenRegenerated(long entityId, string message)
        {
            try
            {
                Group(entityId).ForecastHasBeenRegenerated(message);

            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void ItemsOfflineUpdated(long entityId, string connectionId, List<UpdatedItemCountStatus> statusList)
        {
            try
            {
                Group(entityId, connectionId).ItemsOfflineUpdated(statusList);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void RefreshNotifications(long entityId)
        {
            try
            {
                Group(entityId).RefreshNotifications();
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }


        #region Travel path updates

        public static void TravelPathDataUpdatedPartial(long entityId, long locationId, string connectionId)
        {
            try
            {
                Group(entityId, connectionId).TravelPathDataUpdatedPartial(locationId, entityId);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void ActivateLocation(long entityId, TravelPath travelPath, string connectionId)
        {
            try
            {
                Group(entityId, connectionId).ActivateLocation(travelPath, entityId);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void DeActivateLocation(long entityId, TravelPath travelPath, string connectionId)
        {
            try
            {
                Group(entityId, connectionId).DeActivateLocation(travelPath, entityId);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void NewLocationReceived(long entityId, TravelPath travelPath, string connectionId)
        {
            try
            {
                Group(entityId, connectionId).NewLocationReceived(travelPath, entityId);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void RenameLocation(long entityId, TravelPath travelPath, string connectionId)
        {
            try
            {
                Group(entityId, connectionId).RenameLocation(travelPath, entityId);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        public static void ResortLocation(long entityId, long[] locationIds, string connectionId)
        {
            try
            {
                Group(entityId, connectionId).ResortLocation(locationIds, entityId);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }
        }

        #endregion

    }
}