using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;
using System;

namespace Mx.Web.UI.Areas.Administration.User.Api.Models
{
    [MapFrom(typeof(UserSettingValueResponse))]
    public class UserSettingValue
    {
        public Int64 UserId { get; set; }
        public Int64 UserSettingId { get; set; }
        public String Value { get; set; }
    }
}