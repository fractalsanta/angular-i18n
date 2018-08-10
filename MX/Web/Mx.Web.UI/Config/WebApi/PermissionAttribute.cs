using System;
using System.Web.Http.Filters;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Config.WebApi
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class PermissionAttribute : FilterAttribute
    {
        public Task[] Tasks { get; private set; }

        public PermissionAttribute(params Task[] tasks)
        {
            Tasks = tasks;
        }
    }
}