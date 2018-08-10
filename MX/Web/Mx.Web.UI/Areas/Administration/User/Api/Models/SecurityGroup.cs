using System;
using Mx.Web.UI.Config.Mapping;
using Mx.Administration.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Administration.User.Api.Models
{
    [MapFrom(typeof(SecurityGroupResponse))]
    public class SecurityGroup
    {
        public Int64 Id { get; set; }
        public String Name { get; set; }
        public String Description { get; set; }
        public Boolean IsDefault { get; set; }
        public Boolean IsEditable { get; set; }
    }
}