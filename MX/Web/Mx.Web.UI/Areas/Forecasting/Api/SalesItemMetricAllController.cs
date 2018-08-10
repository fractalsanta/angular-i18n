using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class SalesItemMetricAllController : ForecastControllerBase
    {
        private readonly IForecastQueryService _forecastQueryService;
        private readonly IForecastSalesItemMetricQueryService _forecastMetricQueryService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IDaySegmentQueryService _daySegmentQueryService;
        private readonly ISalesItemMetricDetailCommandService _salesItemMetricDetailCommandService;
        private readonly IMappingEngine _mappingEngine;

        public SalesItemMetricAllController(
            IForecastSalesItemMetricQueryService forecastSalesItemMetricQueryService,
            ISalesItemMetricDetailCommandService salesItemMetricDetailCommandService,
            IForecastQueryService forecastQueryService,
            IEntityQueryService entityQueryService,
            IDaySegmentQueryService daysegmentQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IMappingEngine mappingEngine,
            IAuthorizationService authorizationService,
            IAuthenticationService authenticationService)
            : base(userAuthenticationQueryService, authorizationService, authenticationService)
        {
            _forecastQueryService = forecastQueryService;
            _forecastMetricQueryService = forecastSalesItemMetricQueryService;
            _entityQueryService = entityQueryService;
            _daySegmentQueryService = daysegmentQueryService;
            _salesItemMetricDetailCommandService = salesItemMetricDetailCommandService;
            _mappingEngine = mappingEngine;
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>
        public ForecastingSalesItemMetricAlls GetForecastingSalesItemMetricAlls(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int32? filterId = null,
            [FromUri] Boolean includeActuals = false,
            [FromUri] Boolean aggregate = false
            )
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            var forecastDetailResponse = _forecastMetricQueryService.GetForecastSalesItemMetrics<ForecastSalesItemMetricResponseByInterval>(forecastId, filterId, includeActuals);
            if (forecastDetailResponse == null || forecastDetailResponse.EntityId != entityId)
            {
                throw new MissingResourceException("Forecast not found.");
            }

            if (aggregate)
            {
                Aggregate(forecastDetailResponse);
            }

            var forecast = _forecastQueryService.GetById(forecastId, filterId: null);

            var segments = _daySegmentQueryService.GetForEntityAndBusinessDay(entityId, forecast.BusinessDay);

            var response = GetForecastSalesItemMetricAllResponse(forecastDetailResponse, forecast, segments.ToList());

            return _mappingEngine.Map<ForecastingSalesItemMetricAlls>(response);
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>/{salesItemId}
        public ForecastingSalesItemMetricAlls GetSalesItemMetrics(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int64 id,
            [FromUri] Int32? filterId = null,
            [FromUri] Boolean includeActuals = false,
            [FromUri] Boolean aggregate = false
            )
        {
            var parentController = new SalesItemMetricController(_forecastMetricQueryService,
                                _salesItemMetricDetailCommandService,
                                _entityQueryService,
                                UserAuthenticationQueryService,
                                _authorizationService,
                                _authenticationService);

            var forecastDetailResponse = parentController.GetForecastSalesItemMetric(entityId, forecastId, id, filterId, includeActuals, aggregate);

            var forecast = _forecastQueryService.GetById(forecastId, filterId: null);

            var segments = _daySegmentQueryService.GetForEntityAndBusinessDay(entityId, forecast.BusinessDay);

            var response = GetForecastSalesItemMetricAllResponse(forecastDetailResponse, forecast, segments.ToList());

            return _mappingEngine.Map<ForecastingSalesItemMetricAlls>(response);
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>/{salesItemId}
        public ForecastingSalesItemMetricAlls GetSalesItemMetricDetailsById(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] String ids,
            [FromUri] Int32? filterId = null,
            [FromUri] Boolean aggregate = false
            )
        {
            var parentController = new SalesItemMetricController(_forecastMetricQueryService,
                                _salesItemMetricDetailCommandService,
                                _entityQueryService,
                                UserAuthenticationQueryService,
                                _authorizationService,
                                _authenticationService);

            var forecastDetailResponse = parentController.GetForecastSalesItemMetric(entityId, forecastId, ids, filterId, aggregate);

            var forecast = _forecastQueryService.GetById(forecastId, filterId: null);

            var segments = _daySegmentQueryService.GetForEntityAndBusinessDay(entityId, forecast.BusinessDay);

            var response = GetForecastSalesItemMetricAllResponse(forecastDetailResponse, forecast, segments.ToList());

            return _mappingEngine.Map<ForecastingSalesItemMetricAlls>(response);
        }

        private static void Aggregate(ForecastSalesItemMetricResponse response)
        {
            if (!response.SalesItemMetricDetails.Any())
                return;

            var result = new List<SalesItemMetricDetailResponse>();
            foreach (var g in response.SalesItemMetricDetails.GroupBy(x => x.SalesItemId))
            {
                var aggregated = new SalesItemMetricDetailResponse();
                var prototype = g.FirstOrDefault();
                if (prototype != null)
                {
                    aggregated.BusinessDay = prototype.BusinessDay;
                    aggregated.IntervalStart = prototype.IntervalStart;
                    aggregated.SalesItemId = prototype.SalesItemId;
                    foreach (var x in g)
                    {
                        aggregated.ActualQuantity += x.ActualQuantity;
                        aggregated.LastYearTransactionCount += x.LastYearTransactionCount;
                        aggregated.ManagerTransactionCount += x.ManagerTransactionCount;
                        aggregated.SystemTransactionCount += x.SystemTransactionCount;
                    }
                }
                result.Add(aggregated);
            }
            response.SalesItemMetricDetails = result;
        }

        private List<SalesItemMetricAllDetailResponse> EnsureInterval(IList<SalesItemMetricAllDetailResponse> intervals, DateTime start, DateTime end)
        {
            var result = new List<SalesItemMetricAllDetailResponse>();

            var current = start;
            while (current < end)
            {
                var interval = intervals.FirstOrDefault(x => x.IntervalStart == current) ?? new SalesItemMetricAllDetailResponse();

                interval.IntervalStart = current;
                interval.IntervalType = MetricAllTimeSpanType.Interval;
                result.Add(interval);
                current = current.AddMinutes(15);
            }

            return result;
        }

        private static void Sum(SalesItemMetricDetailResponse dest, IEnumerable<SalesItemMetricAllDetailResponse> g)
        {
            dest.ManagerTransactionCount = 0;
            dest.LastYearTransactionCount = 0;
            dest.ActualQuantity = 0;
            dest.SystemTransactionCount = 0;
            foreach (var x in g)
            {
                dest.ManagerTransactionCount += x.ManagerTransactionCount;
                dest.LastYearTransactionCount += x.LastYearTransactionCount;
                dest.ActualQuantity += x.ActualQuantity;
                dest.SystemTransactionCount += x.SystemTransactionCount;
            }
        }

        private void InsertHours(List<SalesItemMetricAllDetailResponse> intervals, DateTime businessDayStart, DateTime businessDayEnd)
        {
            var hourlyIntervals = new List<SalesItemMetricAllDetailResponse>();

            var current = businessDayStart;
            while (current < businessDayEnd)
            {
                var hour = new SalesItemMetricAllDetailResponse
                {
                    IntervalType = MetricAllTimeSpanType.Hour,
                    IntervalStart = current
                };

                var nextInterval = current.AddHours(1);
                Sum(hour, intervals.Where(x => x.IntervalStart >= current && x.IntervalStart < nextInterval).ToList());

                hourlyIntervals.Add(hour);

                current = nextInterval;
            }

            intervals.AddRange(hourlyIntervals);
        }

        private void InsertDaySegments(ICollection<SalesItemMetricAllDetailResponse> intervals, IList<DaySegmentResponse> daySegments)
        {
            foreach (var dayS in daySegments)
            {
                var intervalsInDaySegment = (from md in intervals
                                             where md.IntervalStart >= dayS.StartTime
                                                   && md.IntervalStart < dayS.EndTime
                                                   && md.IntervalType == MetricAllTimeSpanType.Interval
                                             select md).ToList();

                if (!intervalsInDaySegment.Any())
                    continue;

                var dsInterval = new SalesItemMetricAllDetailResponse
                {
                    IntervalType = MetricAllTimeSpanType.DaySegment,
                    IntervalStart = intervalsInDaySegment.Min(x => x.IntervalStart)
                };

                Sum(dsInterval, intervalsInDaySegment);

                intervals.Add(dsInterval);

                // add additional hour total if not starting on the hour
                // For example : Afternoon segment start from 2:30 PM. We need to have 1 hourly interval from 2:30 PM -> 3:00 PM
                // and update prior hourly interval from 2:00PM -> 2:30 PM
                if (dsInterval.IntervalStart.Minute != 0)
                {
                    var splitTime = dsInterval.IntervalStart;
                    var latterHourlyInterval = BuildLatterHourlyInterval(intervals, splitTime);

                    intervals.Add(latterHourlyInterval);

                    // update hourly interval for the first part of the hour
                    var priorHourlyInterval =
                        intervals.First(x => x.IntervalStart.Hour == splitTime.Hour 
                                             && x.IntervalType == MetricAllTimeSpanType.Hour);
                    Sum(priorHourlyInterval,
                        intervals.Where(
                            x => x.IntervalStart >= priorHourlyInterval.IntervalStart && x.IntervalStart < splitTime
                                 && x.IntervalType == MetricAllTimeSpanType.Interval).ToList());
                }
            }
        }

        private SalesItemMetricAllDetailResponse BuildLatterHourlyInterval(
            ICollection<SalesItemMetricAllDetailResponse> intervals, DateTime splitTime)
        {
            var hInterval = new SalesItemMetricAllDetailResponse
            {
                IntervalType = MetricAllTimeSpanType.Hour,
                IntervalStart = splitTime
            };

            var fromTime = splitTime;
            var toTime = RoundDownToHour(fromTime.AddHours(1));
            Sum(hInterval,
                intervals.Where(
                    x => x.IntervalStart >= fromTime && x.IntervalStart < toTime
                         && x.IntervalType == MetricAllTimeSpanType.Interval).ToList());

            return hInterval;
        }

        private DateTime RoundDownToHour(DateTime givenTime)
        {
            return givenTime.AddMinutes(-givenTime.Minute);
        }

        private static void InsertForecast(ICollection<SalesItemMetricAllDetailResponse> allIntervals, ForecastResponse forecast)
        {
            var fi = new SalesItemMetricAllDetailResponse
            {
                IntervalType = MetricAllTimeSpanType.Forecast,
                IntervalStart = forecast.BusinessDayStart
            };

            var intervals = allIntervals.Where(x => x.IntervalType == MetricAllTimeSpanType.Interval).ToList();

            fi.LastYearTransactionCount = intervals.Sum(x => x.LastYearTransactionCount);
            fi.ManagerTransactionCount = intervals.Sum(x => x.ManagerTransactionCount);
            fi.SystemTransactionCount = intervals.Sum(x => x.SystemTransactionCount);

            allIntervals.Add(fi);
        }

        private class SalesItemMetricAllDetailResponse : SalesItemMetricDetailResponse, IConfigureAutoMapping
        {
            public MetricAllTimeSpanType IntervalType { get; set; }

            public static void ConfigureAutoMapping()
            {
                Mapper.CreateMap<SalesItemMetricDetailResponse, SalesItemMetricAllDetailResponse>();
            }
        }

        private ForecastSalesItemMetricAllResponse GetForecastSalesItemMetricAllResponse(ForecastSalesItemMetricResponse response, 
            ForecastResponse forecast, IList<DaySegmentResponse> daySegments)
        {
            var allResponse = new ForecastSalesItemMetricAllResponse();

            var list = response.SalesItemMetricDetails.Select(Mapper.Map<SalesItemMetricDetailResponse, SalesItemMetricAllDetailResponse>).ToList();

            list = EnsureInterval(list, forecast.BusinessDayStart, forecast.BusinessDayEnd);
            list.ForEach(x => x.IntervalType = MetricAllTimeSpanType.Interval);

            InsertHours(list, forecast.BusinessDayStart, forecast.BusinessDayEnd);
            var orderedDaySegments = daySegments.OrderBy(x => x.StartTime).ToList();

            InsertDaySegments(list, orderedDaySegments);
            InsertForecast(list, forecast);

            list = list.OrderBy(x => x.IntervalStart).ThenBy(x => x.IntervalType).ToList();

            allResponse.TypeIndexes = GetTypeIndexes(list);

            allResponse.DaySegments = orderedDaySegments;
            allResponse.DaySegmentIndexes = BuildDaySegmentIndexList(list, orderedDaySegments).ToArray();

            allResponse.Id = response.Id;
            allResponse.EntityId = response.EntityId;
            allResponse.GenerationDate = response.GenerationDate;
            allResponse.BusinessDay = response.BusinessDay;

            allResponse.IntervalTypes = new Int32[list.Count];
            allResponse.IntervalStarts = new DateTime[list.Count];
            allResponse.ManagerTransactions = new Double[list.Count];
            allResponse.LastYearTransactions = new Double[list.Count];
            allResponse.SystemTransactions = new Double[list.Count];

            for (var i = 0; i < list.Count; i++)
            {
                var md = list[i];
                allResponse.IntervalTypes[i] = (Int32)md.IntervalType;
                allResponse.IntervalStarts[i] = md.IntervalStart;
                allResponse.ManagerTransactions[i] = md.ManagerTransactionCount;
                allResponse.LastYearTransactions[i] = md.LastYearTransactionCount;
                allResponse.SystemTransactions[i] = md.SystemTransactionCount;
            }

            allResponse.ActualQuantitys = new Double[0];
            allResponse.NewManagerTransactions = new Double[0];

            return allResponse;
        }

        private int[][] GetTypeIndexes(List<SalesItemMetricAllDetailResponse> list)
        {
            var typeIndexes = new Int32[10][];
            var grps = list.GroupBy(x => x.IntervalType);
            foreach (var g in grps)
            {
                typeIndexes[(Int32)g.Key] = g.Select(x => list.IndexOf(x)).ToArray();
            }
            for (var i = 0; i < typeIndexes.Length; i++)
            {
                typeIndexes[i] = typeIndexes[i] ?? new Int32[0];
            }

            return typeIndexes;
        }

        private List<int> BuildDaySegmentIndexList(List<SalesItemMetricAllDetailResponse> list, IList<DaySegmentResponse> daySegments)
        {
            var daySegmentIndexList = new List<int>();

            foreach (var md in list)
            {
                var daySegmentFound = false;
                foreach (var ds in daySegments)
                {
                    if (md.IntervalStart >= ds.StartTime
                        && md.IntervalStart < ds.EndTime)
                    {
                        daySegmentIndexList.Add(daySegments.IndexOf(ds));
                        daySegmentFound = true;
                        break;
                    }
                }

                if (!daySegmentFound)
                {
                    daySegmentIndexList.Add(-1);
                }
            }

            return daySegmentIndexList;
        }
    }
}