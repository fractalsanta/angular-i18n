using AutoMapper;
using Mx.Administration.Services.Contracts.CommandServices;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Administration.User.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using System;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Administration.User.Api
{
    public class UserSettingsController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserSettingValueQueryService _userSettingValueQueryService;
        private readonly IUserSettingValueCommandService _userSettingValueCommandService;

        public UserSettingsController(
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            IUserSettingValueQueryService userSettingValueQueryService,
            IUserSettingValueCommandService userSettingValueCommandService) 
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _userSettingValueQueryService = userSettingValueQueryService;
            _userSettingValueCommandService = userSettingValueCommandService;
        }

        public String GetUserSetting([FromUri] UserSettingEnum userSetting)
        {
            var userSettingString = String.Empty;
            var user = _authenticationService.User;

            var userSettingValue = _userSettingValueQueryService.GetAsRawJSON(user.Id, (Int64)userSetting);

            var result = _mapper.Map<UserSettingValue>(userSettingValue);
            
            if (result != null)
            {
                userSettingString = result.Value;
            }

            return userSettingString;
        }

        public void PutUserSetting(UserSettingEnum userSetting, String value)
        {
            var user = _authenticationService.User;

            var request = new UserSettingValueRequest
            {
                UserId = user.Id,
                UserSettingId = (Int64)userSetting,
                Value = value
            };
            
            _userSettingValueCommandService.UpdateUserSettingValue(request);
        }
    }
}