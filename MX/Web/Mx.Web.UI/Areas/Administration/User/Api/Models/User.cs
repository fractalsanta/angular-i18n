using System;
using Mx.Web.UI.Config.Mapping;
using Mx.Administration.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Administration.User.Api.Models
{
    [MapFrom(typeof(UserResponse))]
    public class User
    {
        public Int64 Id { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String MiddleName { get; set; }
        public String EmployeeNumber { get; set; }
        public String UserName { get; set; }
        public String Status { get; set; }

        public Int64[] SecurityGroups { get; set; }
        public Entity Entity { get; set; }
    }
}