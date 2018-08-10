using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    internal class ReportAttribute : Attribute
    {
        public Task AccessPermission;
        public Task ViewManagerPermission;
        public Task SharedViewsPermission;
        public ReportViewType ViewType;

        public ReportAttribute(Task accessPermission, Task viewManagerPermission, Task sharedViewsPermission, ReportViewType viewType)
        {
            AccessPermission = accessPermission;
            ViewManagerPermission = viewManagerPermission;
            SharedViewsPermission = sharedViewsPermission;
            ViewType = viewType;
        }
    }
}