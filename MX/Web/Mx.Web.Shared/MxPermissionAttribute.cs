using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.Shared.Providers;

namespace Mx.Web.Shared
{
    public class PermissionAttribute : AuthorizeAttribute
    {
        public Task[] Tasks { get; private set; }

        public PermissionAttribute(params Task[] tasks)
        {
            Tasks = tasks;
        }

        protected override Boolean AuthorizeCore(HttpContextBase httpContext)
        {
            if (!httpContext.User.Identity.IsAuthenticated)
                return false;

            var user = httpContext.Profile.GetPropertyValue("BusinessUser") as BusinessUser;

            return user != null && Tasks.Any(user.HasPermission);
        }
    }

    public class Permissions : IConfigureAutoMapping
    {
        public Permissions()
        {
            Usage = new Dictionary<Int32, Int64>();
            GroupIds = new List<Int64>();
        }

        public IDictionary<Int32, Int64> Usage { get; set; }
        public IList<Int64> GroupIds { get; set; }

        public Boolean HasPermission(Task task)
        {
            return HasPermission((Int32)task);
        }

        public Boolean HasPermission(Int32 task)
        {
            var usageIndex = (task / 64) + 1;
            var bit = (task % 64) - 1;
            var mask = (Int64)1 << bit;

            if (Usage.ContainsKey(usageIndex))
            {
                return (Usage[usageIndex] & mask) == mask;
            }

            return false;
        }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<UserResponse.Permissions, Permissions>();
        }

    }

    public enum Task
    {
        // ReSharper disable InconsistentNaming
        // No_Permission_Needed = 0,
        #region Usage 3

        Security_CanAccessAllGroups = 128 + 13,

        #endregion

        #region Mobile Usage 1

        Inventory_InventoryCount_CanView = 1216 + 1,
        Inventory_TravelPath_CanUpdate = 1216 + 2,
        Reporting_Dashboard_CanView = 1216 + 3,
        Labor_EmployeePortal_CanView = 1216 + 4,
        Inventory_Transfers_CanView = 1216 + 5,
        Labor_EmployeePortal_TimeCard_CanView = 1216 + 6,
        Labor_EmployeePortal_Availability_CanView = 1216 + 7,
        Labor_EmployeePortal_MyDetails_CanView = 1216 + 8,
        Inventory_Waste_CanView = 1216 + 9,
        Inventory_Ordering_CanView = 1216 + 10,
        Labor_EmployeePortal_MyDetails_CanUpdate = 1216 + 11,
        Labor_EmployeePortal_Availability_CanUpdate = 1216 + 12,
        Administration_ReportMeasures_Application_CanUpdate = 1216 + 13,
        Administration_ReportMeasures_Global_CanUpdate = 1216 + 14,
        Administration_ReportMeasures_Store_CanUpdate = 1216 + 15,
        Labor_EmployeePortal_MyTimeOff_CanView = 1216 + 16,
        Inventory_InventoryCount_CanView_Variance = 1216 + 17,
        Inventory_InventoryCount_CanView_Review = 1216 + 18,
        Inventory_InventoryCount_CanUpdate_Cost = 1216 + 19,
        Inventory_Ordering_CanReceive = 1216 + 20,
        Inventory_TravelPath_SpotFrequency_CanView = 1216 + 21,
        Inventory_TravelPath_DailyFrequency_CanView = 1216 + 22,
        Inventory_TravelPath_WeeklyFrequency_CanView = 1216 + 23,
        Inventory_TravelPath_MonthlyFrequency_CanView = 1216 + 24,
        Inventory_TravelPath_PeriodicFrequency_CanView = 1216 + 25,
        Inventory_Ordering_CanCreate = 1216 + 26,
        Inventory_TravelPath_CanDeleteItem = 1216 + 27,
        Inventory_TravelPath_CanDeleteLocation = 1216 + 28,
        Labor_EmployeePortal_MySchedule_CanViewTeamMembers = 1216 + 29,
        Forecasting_CanView = 1216 + 32,
        DataLoad_CanView = 1216 + 35
        
        #endregion
        // ReSharper restore InconsistentNaming
    }
}