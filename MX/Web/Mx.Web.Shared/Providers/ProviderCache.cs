using System;
using System.Globalization;
using System.Web;
using System.Web.Caching;
using AutoMapper;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.Responses;

namespace Mx.Web.Shared.Providers
{
    public class ProviderCache : IProviderCache
    {
        private static readonly String Key = "UserData";

        private IUserAuthenticationQueryService UserAuthenticationQueryService { get; set; }
        private ILocalisationQueryService LocalisationQueryService { get; set; }
        private IMappingEngine Mapper { get; set; }

        public ProviderCache(IUserAuthenticationQueryService userAuthenticationQueryService, 
            ILocalisationQueryService localisationQueryService,
            IMappingEngine mappingEngine)
        {
            UserAuthenticationQueryService = userAuthenticationQueryService;
            LocalisationQueryService = localisationQueryService;
            Mapper = mappingEngine;
        }

        public BusinessUser GetUser(String userName)
        {
            var user = HttpContext.Current.Cache[Key + userName] as BusinessUser;


            if (user == null || user.Id == 0) 
            {
                var tempResult = UserAuthenticationQueryService.GetByUserName(HttpContext.Current.User.Identity.Name);
                user = Mapper.Map<UserResponse, BusinessUser>(tempResult);

                HttpContext.Current.Cache.Insert(Key + userName, user, null, Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(15));
            }
            
            return user;
        }

        public void RemoveUser(String userName)
        {
            if (HttpContext.Current.Cache[Key + userName] != null)
                HttpContext.Current.Cache.Remove(Key + userName);
        }

        public MissingUser GetMissingUser()
        {
            var user = HttpContext.Current.Cache[Key + 0] as MissingUser;

            if (user == null)
            {
                user = new MissingUser { Culture = LocalisationQueryService.GetSystemCulture() };

                HttpContext.Current.Cache.Insert(Key + 0, user, null, Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(15));
            }

            return user;
        }
    }
}