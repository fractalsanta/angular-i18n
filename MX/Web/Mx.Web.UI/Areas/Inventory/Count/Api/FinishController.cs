using System;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Labor.Services.Contracts.Requests;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Services.Shared.Contracts.Services;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Enums;
using Mx.Services.Shared.Contracts;
using Mx.Web.UI.Config.Translations;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    [Permission(Task.Inventory_InventoryCount_CanUpdate)]
    public class FinishController : ApiController
    {
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IStockCountLocationCommandService _stockCountLocationCommandService;
        private readonly IApplyDateService _applyDateService;
        private readonly ITranslationService _translationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IConfigurationService _configurationService;
        private readonly IPeriodCloseQueryService _periodCloseQueryService;
        private readonly IMappingEngine _mappingEngine;

        public FinishController(
            IEntityTimeQueryService entityTimeQueryService,
            IStockCountLocationCommandService stockCountLocationCommandService,
            IApplyDateService applyDateService,
            ITranslationService translationService,
            IConfigurationService configurationService,
            IAuthenticationService authenticationService,
            IPeriodCloseQueryService periodCloseQueryService,
            IMappingEngine mappingEngine
            )
        {
            _entityTimeQueryService = entityTimeQueryService;
            _stockCountLocationCommandService = stockCountLocationCommandService;
            _applyDateService = applyDateService;
            _translationService = translationService;
            _configurationService = configurationService;
            _authenticationService = authenticationService;
            _periodCloseQueryService = periodCloseQueryService;
            _mappingEngine = mappingEngine;
        }

        public ApplyCount Post([FromBody] FinishCountRequest model)
        {
            var requestTime = _entityTimeQueryService.GetCurrentStoreTime(model.EntityId);
            var user = _authenticationService.User;
            var l10N = _translationService.Translate<Models.L10N>(user.Culture);
            var auditUser = _mappingEngine.Map<AuditUser>(user);

            CheckPeriodStatus((int) model.EntityId, requestTime, user);

            var request = new ApplyCountRequest
            {
                CountId = model.CountId,
                EntityId = model.EntityId,
                ApplyDate = (model.ApplyDate == null) ? requestTime : DateTime.Parse(model.ApplyDate),
                RequestTime = requestTime,
                CountTypeName = model.CountKey,
                IsSuggestedDate = model.IsSuggestedDate,
                CountType = (StockCountType)Enum.Parse(typeof(StockCountType), model.CountType),
                WeekEndingDefinition = l10N.WeekEnding,
                PeriodDefinition = l10N.Period,
                CountDefinition = l10N.Count,
                ClerkId = user.Id,
                ClerkName = user.UserName,
                AuditUser = auditUser
            };

            var result = _stockCountLocationCommandService.ApplyCount(request);

                ApplicationHub.CountSubmitted(model.EntityId, model.ConnectionId, model.CountId, user.FormatNameFirstLastId());
                ApplicationHub.CountStateChanged(model.EntityId);
            return Mapper.Map<ApplyCount>(result);
        }

        public ApplyDateSettings GetApplyDateByCountType(
            [FromUri] Int64 entityId,
            [FromUri] StockCountType countType
            )
        {
            var result = CreateApplyDateResult(entityId);

            switch (GetApplyDateTimeSetting())
            {
                case StockCountApplyDateConfiguration.AllowEntry:
                    result.IsApplyReadOnly = false;
                    break;

                case StockCountApplyDateConfiguration.ClientSpecific:
                    CallClientSpecificCode(entityId, countType, result);
                    break;

                case StockCountApplyDateConfiguration.UseStoreTime:
                    result.IsApplyReadOnly = true;
                    break;
            }

            return Mapper.Map<ApplyDateSettings>(result);


        }

        private void CallClientSpecificCode(long entityId, StockCountType countType, ApplyDateResponse result)
        {
            var user = _authenticationService.User;
            var l10N = _translationService.Translate<Models.L10N>(user.Culture);
            var trans = new ApplyTranslations
            {
                EndOfPeriod = l10N.EndOfPeriod,
                MidPeriod = l10N.MidPeriod,
                WeekEnding = l10N.WeekEnding,
            };
            _applyDateService.GetApplyDate(entityId, countType, result, trans);
        }

        private ApplyDateResponse CreateApplyDateResult(long entityId)
        {
            var storetime = _entityTimeQueryService.GetCurrentStoreTime(entityId);

            var result = new ApplyDateResponse
            {
                StoreDateTime = storetime,
                ApplyDateTime = storetime,
                Detail = string.Empty,
                IsApplyReadOnly = false,
            };
            return result;
        }

        private StockCountApplyDateConfiguration GetApplyDateTimeSetting()
        {
            var value = _configurationService.GetConfiguration(ConfigurationEnum.Inventory_Counts_CountApplyDateTimeSelectionMethod).As<int>();
            if (value == 0)
            {
                value = 3;
            }
            return (StockCountApplyDateConfiguration) value;
        }

        private void CheckPeriodStatus(int entityId, DateTime date, BusinessUser user)
        {
            var periodRequest = new PeriodCloseRequest
            {
                EntityId = entityId,
                CalendarDay = date
            };
            var period = _periodCloseQueryService.GetForDate(periodRequest);

            if (period.IsClosed && !user.Permission.HasPermission(Task.Waste_CanEditClosedPeriods))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
        }
    }
}