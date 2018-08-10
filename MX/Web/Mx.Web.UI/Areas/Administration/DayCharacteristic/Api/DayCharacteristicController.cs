using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Administration.DayCharacteristic.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Mx.Web.UI.Config.WebApi;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.CommandServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Services.Shared.Exceptions;
namespace Mx.Web.UI.Areas.Administration.DayCharacteristic.Api
{
    public class DayCharacteristicController : RESTController
    {
        IDayCharacteristicQueryService _queryService;
        IDayCharacteristicCommandService _commandService;
        IEntityDayCharacteristicQueryService _entityDayCharacteristicQueryService;
        IEntityDayCharacteristicCommandService _entityDayCharacteristicCommandService;
        IEntityQueryService _entityQueryService;

        public DayCharacteristicController(IDayCharacteristicQueryService queryService,
            IEntityDayCharacteristicQueryService entityDayCharacteristicQueryService,
            IDayCharacteristicCommandService commandService,
            IEntityDayCharacteristicCommandService entityDayCharacteristicCommandService,
            IEntityQueryService entityQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService) :
            base(userAuthenticationQueryService)
        {
            _commandService = commandService;
            _queryService = queryService;
            _entityDayCharacteristicQueryService = entityDayCharacteristicQueryService;
            _entityDayCharacteristicCommandService = entityDayCharacteristicCommandService;
            _entityQueryService = entityQueryService;
        }

        #region Global Day Characteristic
        // GET api/daycharacteristic
        public IEnumerable<DayCharacteristic.Api.Models.DayCharacteristic> Get()
        {
            return Mapper.Map<IEnumerable<DayCharacteristic.Api.Models.DayCharacteristic>>(_queryService.GetAll());
        }

        // PUT api/daycharacteristic/5
        public void Put([FromBody]IEnumerable<DayCharacteristic.Api.Models.DayCharacteristic> value)
        {
            if (value == null) { throw new InvalidQueryParameterException(); }
            _commandService.Save(Mapper.Map<IEnumerable<DayCharacteristicRequest>>(value));   
        }

        // DELETE api/daycharacteristic/5
        public void Delete([FromBody]IEnumerable<DayCharacteristic.Api.Models.DayCharacteristic> value)
        {
            if (value == null) { throw new InvalidQueryParameterException(); }
            _commandService.Delete(Mapper.Map<IEnumerable<DayCharacteristicRequest>>(value));
        }
        #endregion

        #region Day Characteristics for entity and date
        //GET api/entity/{id}/daycharacteristic/2014-4-17
        public DayCharacteristic.Api.Models.EntityDayCharacteristic Get(Int64 entityId, DateTime businessDay)
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            return Mapper.Map<DayCharacteristic.Api.Models.EntityDayCharacteristic>(_entityDayCharacteristicQueryService.Get(entityId, businessDay)) ?? new EntityDayCharacteristic() { Notes = "", DayCharacteristics = new List<DayCharacteristic.Api.Models.DayCharacteristic>() };
        }


        // PUT api/daycharacteristic/5
        public void Put(Int64 entityId, String businessDay, [FromBody]DayCharacteristic.Api.Models.EntityDayCharacteristic value)
        {
            if (value == null) { throw new InvalidQueryParameterException(); }
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            DateTime targetDate;
            if (!DateTime.TryParse(businessDay, out targetDate))
            {
                throw new InvalidQueryParameterException("Date format invalid.");
            }


            var request = Mapper.Map<EntityDayCharacteristicRequest>(value);
            request.EntityId = entityId;
            request.BusinessDate = targetDate;

            _entityDayCharacteristicCommandService.Set(request);

        }
        #endregion

    }
}
