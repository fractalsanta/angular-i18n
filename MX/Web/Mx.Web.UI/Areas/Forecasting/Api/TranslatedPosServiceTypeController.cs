using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class TranslatedPosServiceTypeController : ApiController
    {
        private readonly ILocalisationQueryService _localisationQueryService;
        private readonly IAuthenticationService _authenticationService;

        public TranslatedPosServiceTypeController(
            ILocalisationQueryService localisationQueryService,
            IAuthenticationService authenticationService)
        {
            _localisationQueryService = localisationQueryService;
            _authenticationService = authenticationService;
        }

        public IEnumerable<TranslatedEnum> GetPosServiceTypeEnumTranslations()
        {
            var localizedPosServiceTypes = new List<TranslatedEnum>();
            var nonlocalizedCustomPosServiceTypes = new List<TranslatedEnum>();

            var localizationDictionary = _localisationQueryService.GetPageTranslation("PosServiceType",
                _authenticationService.User.Culture);

            foreach (PosServiceType enumValue in Enum.GetValues(typeof(PosServiceType)))
            {
                var enumStringValue = Enum.GetName(typeof(PosServiceType), enumValue);
                var tempTranslation = localizationDictionary[enumStringValue];

                var translatedEnum = new TranslatedEnum
                {
                    Value = (int)enumValue,
                    Name = enumStringValue,
                    Translation = tempTranslation
                };

                if(tempTranslation.StartsWith("Custom") && tempTranslation.Equals(enumStringValue))
                {
                    nonlocalizedCustomPosServiceTypes.Add(translatedEnum);
                }
                else
                {
                    localizedPosServiceTypes.Add(translatedEnum);
                }
            }

            localizedPosServiceTypes = localizedPosServiceTypes.OrderBy(x => x.Translation).ToList();

            localizedPosServiceTypes = localizedPosServiceTypes.Concat(nonlocalizedCustomPosServiceTypes).ToList();

            return localizedPosServiceTypes;
        }
    }
}