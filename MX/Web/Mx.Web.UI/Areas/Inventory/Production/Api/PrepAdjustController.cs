using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Production.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Production.Api
{
    [Permission(Task.Inventory_PrepAdjust_CanView)]
    public class PrepAdjustController : ApiController
    {
        private readonly IPrepAdjustCommandService _prepAdjustCommandService;
        private readonly IMxDayQueryService _dayQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IPrepAdjustQueryService _prepAdjustQueryService;
        private readonly IMappingEngine _mappingEngine;

        public PrepAdjustController(
            IPrepAdjustCommandService prepAdjustCommandService,
            IMxDayQueryService dayQueryService,
            IAuthenticationService authenticationService,
            IPrepAdjustQueryService prepAdjustQueryService,
            IMappingEngine mappingEngine
            )
        {
            _prepAdjustCommandService = prepAdjustCommandService;
            _dayQueryService = dayQueryService;
            _authenticationService = authenticationService;
            _prepAdjustQueryService = prepAdjustQueryService;
            _mappingEngine = mappingEngine;
        }

        public IEnumerable<PrepAdjustedItem> GetPrepAdjustItemsByEntityId([FromUri]Int64 entityId)
        {
            var prepAdjustItemsResponse = _prepAdjustQueryService.GetPrepAdjustItemsByEntity(entityId, null, 0);
            return _mappingEngine.Map<IEnumerable<PrepAdjustedItem>>(prepAdjustItemsResponse.PrepAdjustItemResponses);
        }

        public void PostPrepAdjustItems([FromUri]Int64 entityId, [FromBody]IEnumerable<PrepAdjustedItem> items, [FromUri]string applyDate)
        {
            var actualDate = applyDate.AsDateTime() ?? DateTime.Now;
            var user = _authenticationService.User;
            var reqItems = _mappingEngine.Map<IEnumerable<PrepAdjustItemRequest>>(items).ToList();

            var businessDate = _dayQueryService.GetForTradingDate(new MxDayRequest
            {
                Date = actualDate,
                EntityId = entityId
            });

            var batchNumber = Convert.ToInt32(string.Format("{0}{1}{2}{3}{4}{5}", RandomNumber(1, 9), actualDate.ToString("HH"), RandomNumber(1, 9), actualDate.ToString("mm") , actualDate.ToString("ss"), RandomNumber(1, 9)));

            _prepAdjustCommandService.AdjustBomProductionEntityItems(new PrepAdjustItemsRequest
            {
                UserId = user.Id,
                UserName = user.UserName,
                ApplyDate = actualDate,
                EntityId = entityId,
                BusinessDate = businessDate.CalendarDay,
                Items = reqItems,
                BatchNumber = batchNumber
            });            
        }

        private static int RandomNumber(int maxNumber, int minNumber = 0)
        {
            var r = new Random(DateTime.Now.Millisecond);
            if (minNumber <= maxNumber) return r.Next(minNumber, maxNumber);
            var t = minNumber;
            minNumber = maxNumber;
            maxNumber = t;
            return r.Next(minNumber, maxNumber);
        }
    }
}