using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Labor.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Waste.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;
using NHibernate.Linq;
using System.Net;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api
{
    [Permission(Task.Inventory_Waste_CanView)]
    public class WasteController : ApiController
    {
        private readonly IWasteListQueryService _wasteListQueryService;
        private readonly IWasteCommandService _wasteCommandService;
        private readonly IMxDayQueryService _dayQueryService;
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly IPeriodCloseQueryService _periodCloseQueryService;

        public WasteController(
            IWasteListQueryService wasteListQueryService, 
            IWasteCommandService wasteCommandService, 
            IMxDayQueryService dayQueryService,
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            IPeriodCloseQueryService periodCloseQueryService
            )
        {
            _wasteListQueryService = wasteListQueryService;
            _wasteCommandService = wasteCommandService;
            _dayQueryService = dayQueryService;
            _mapper = mapper;
            _authenticationService = authenticationService;
            _periodCloseQueryService = periodCloseQueryService;
        }
       
        public IEnumerable<WastedItemCount> GetWasteItemsLimited(Int32 entityId, String filter)
        {
            const int limit = 100;
            var items = _wasteListQueryService.FindWasteItemsByEntity(entityId, filter, limit);
            var wasteItems = _mapper.Map<WasteItems>(items);

            return wasteItems.InventoryItems.Concat(wasteItems.SalesItems).Take(limit);
        }

        public void PostWasteItems([FromUri]Int32 entityId, [FromBody]IEnumerable<WastedItemCount> items, [FromUri]string applyDate)
        {
            var actualDate = applyDate.AsDateTime() ?? DateTime.Now;
            var user = _authenticationService.User;
            var reqItems = Mapper.Map<IEnumerable<WastedItemCount>, IEnumerable<WastedItemRequest>>(items).ToList();

            CheckPeriodStatus(entityId, actualDate, user);

            var businessDate = _dayQueryService.GetForTradingDate(new MxDayRequest
            {
                Date = actualDate,
                EntityId = entityId
            });            

            _wasteCommandService.WasteItems(new WastedItemsRequest
            {
                UserId = user.Id,
                UserName = user.UserName,
                ApplyDate = actualDate,
                EntityId = entityId,
                BusinessDate = businessDate.CalendarDay,
                Items = reqItems
            });            
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