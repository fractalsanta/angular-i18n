using System;
using Mx.Deliveries.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models
{
    [MapFrom(typeof(UserResponse))]
    public class ClockedOnUser
    {
        public Int64 Id { get; set; }
        public long EntityId { get; set; }
        public long EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
    }
}