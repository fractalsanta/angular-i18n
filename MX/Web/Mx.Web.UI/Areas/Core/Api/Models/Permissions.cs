using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public class Permissions : IConfigureAutoMapping
    {
        public Permissions()
        {
            Usage = new Dictionary<Int32, Int64>();
            GroupIds = new List<Int64>();
        }

        public IDictionary<Int32, Int64> Usage { get; set; }
        public IList<Int64> GroupIds { get; set; }
        public IList<Task> AllowedTasks { get; set; }

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
            Mapper.CreateMap<UserResponse.Permissions, Permissions>().AfterMap((from, to) =>
            {
                to.AllowedTasks = Enum.GetValues(typeof (Task)).Cast<Task>().Where(to.HasPermission).ToList();
            });
        }

    }
}
