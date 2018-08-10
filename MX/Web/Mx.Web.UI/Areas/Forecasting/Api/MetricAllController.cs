using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared.Exceptions;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.ExtensionMethods;
using AutoMapper;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Services.Shared;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class MetricAllController : ForecastControllerBase
    {
        private readonly IForecastQueryService _forecastQueryService;
        private readonly IForecastMetricQueryService _forecastMetricQueryService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IDaySegmentQueryService _daySegmentQueryService;
        private readonly IMxDayQueryService _mxDayQueryService;
        private readonly IMappingEngine _mappingEngine;

        public MetricAllController(
            IForecastMetricQueryService forecastMetricQueryService,
            IForecastQueryService forecastQueryService,
            IEntityQueryService entityQueryService,
            IDaySegmentQueryService daysegmentQueryService,
            IMappingEngine mappingEngine,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IAuthorizationService authorizationService,
            IAuthenticationService authenticationService,
            IMxDayQueryService mxDayQueryService
            )
            : base(userAuthenticationQueryService, authorizationService, authenticationService)
        {
            _forecastQueryService = forecastQueryService;
            _forecastMetricQueryService = forecastMetricQueryService;
            _entityQueryService = entityQueryService;
            _daySegmentQueryService = daysegmentQueryService;
            _mxDayQueryService = mxDayQueryService;
            _mappingEngine = mappingEngine;
        }

        // GET api/Entity/{entityId}/Forecast/{forecastId}/<controller>
        public ForecastingMetricAlls GetForecastMetricAlls(
            [FromUri] Int64 entityId,
            [FromUri] Int64 forecastId,
            [FromUri] Int32? filterId = null,
            [FromUri] Boolean includeActuals = false
            )
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            var forecastDetailResponse = _forecastMetricQueryService.GetForecastMetrics(forecastId, filterId, includeActuals);
            if (forecastDetailResponse == null || forecastDetailResponse.EntityId != entityId)
            {
                throw new MissingResourceException("Forecast not found.");
            }

            var forecast = _forecastQueryService.GetById(forecastId, filterId);

            forecast.IsDayLocked = IsDayLocked(entity.CurrentStoreTime.Date, forecast.BusinessDay);

            var segments = _daySegmentQueryService.GetForEntityAndBusinessDay(entityId, forecast.BusinessDay);

            var response = GetForecastMetricAllResponse(forecastDetailResponse, forecast, segments.ToList(), filterId);

            return _mappingEngine.Map<ForecastingMetricAlls>(response);
        }

        private DateTime RoundDownToHour(DateTime givenTime)
        {
            return givenTime.AddMinutes(-givenTime.Minute);
        }

        /// <summary>
        /// This return a blank forecast data
        /// </summary>
        public ForecastingMetricAlls GetForecastMetricAlls(
            [FromUri] Int64 entityId
            )
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
            {
                throw new MissingResourceException("Entity not found.");
            }

            var entityMxDay = _mxDayQueryService.GetForTradingDate(new MxDayRequest { EntityId = entityId });            

            var forecastDetailResponse = GetEmptyForecastDetailResponse(entityId);

            var forecast = GetEmptyForecastResponse(entityId);
            forecast.BusinessDay = entityMxDay.CalendarDay;
            forecast.BusinessDayStart = entityMxDay.DayOpen;
            forecast.BusinessDayEnd = entityMxDay.DayClose ?? entityMxDay.DayOpen.AddDays(1);

            var segments = _daySegmentQueryService.GetForEntity(entityId);

            var response = GetForecastMetricAllResponse(forecastDetailResponse, forecast, segments.ToList());

            return _mappingEngine.Map<ForecastingMetricAlls>(response);
        }

        private ForecastResponse GetEmptyForecastResponse(long entityId)
        {
            var forecast = new ForecastResponse();
            forecast.EntityId = entityId;
            forecast.BusinessDayStart = forecast.BusinessDay;
            forecast.BusinessDayEnd = forecast.BusinessDayStart.AddHours(24);
            return forecast;
        }

        private ForecastMetricResponse GetEmptyForecastDetailResponse(long entityId)
        {
            var forecastDetailResponse = new ForecastMetricResponse();
            forecastDetailResponse.EntityId = entityId;

            var details = new List<MetricDetailResponse>();
            const Int32 IntervalLength = 15;
            for (int intervalCount = 0; intervalCount < 96; intervalCount++)
            {
                details.Add(new MetricDetailResponse()
                {
                    IntervalStart = DateTime.Now.AddMinutes(IntervalLength * intervalCount)
                });
            }

            forecastDetailResponse.MetricDetails = details;
            return forecastDetailResponse;
        }

        private List<MetricAllDetailResponse> EnsureInterval(IList<MetricAllDetailResponse> intervals, DateTime start, DateTime end)
        {
            var result = new List<MetricAllDetailResponse>();

            var current = start;
            while (current < end)
            {
                var interval = intervals.FirstOrDefault(x => x.IntervalStart == current) ?? new MetricAllDetailResponse();

                interval.IntervalStart = current;
                interval.IntervalType = MetricAllTimeSpanType.Interval;
                result.Add(interval);
                current = current.AddMinutes(15);
            }

            return result;
        }

        private static void Sum(MetricDetailResponse dest, IEnumerable<MetricAllDetailResponse> g)
        {
            dest.ManagerSales = 0;
            dest.ManagerTransactionCount = 0;
            dest.LastYearSales = 0;
            dest.LastYearTransactionCount = 0;
            dest.ActualSales = 0;
            dest.ActualTransactions = 0;
            dest.ServiceType = 0;
            dest.SystemSales = 0;
            dest.SystemTransactionCount = 0;
            foreach (var x in g)
            {
                dest.ManagerSales += x.ManagerSales;
                dest.ManagerTransactionCount += x.ManagerTransactionCount;
                dest.LastYearSales += x.LastYearSales;
                dest.LastYearTransactionCount += x.LastYearTransactionCount;
                dest.ActualSales += x.ActualSales;
                dest.ActualTransactions += x.ActualTransactions;
                dest.ServiceType += x.ServiceType;
                dest.SystemSales += x.SystemSales;
                dest.SystemTransactionCount += x.SystemTransactionCount;
            }
        }

        private void InsertHours(List<MetricAllDetailResponse> intervals, DateTime businessDayStart, DateTime businessDayEnd)
        {
            var hourlyIntervals = new List<MetricAllDetailResponse>();

            var current = businessDayStart;
            while (current < businessDayEnd)
            {
                var hour = new MetricAllDetailResponse
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

        private void InsertDaySegments(ICollection<MetricAllDetailResponse> intervals, IList<DaySegmentResponse> daySegments)
        {
            foreach (var dayS in daySegments)
            {
                var metricAllDetailResponses = (from md in intervals
                    where md.IntervalStart >= dayS.StartTime
                          && md.IntervalStart < dayS.EndTime
                          && md.IntervalType == MetricAllTimeSpanType.Interval
                    select md).ToList();

                if (!metricAllDetailResponses.Any())
                    continue;

                var dsInterval = new MetricAllDetailResponse
                {
                    IntervalType = MetricAllTimeSpanType.DaySegment,
                    IntervalStart = metricAllDetailResponses.Min(x=> x.IntervalStart)
                };

                Sum(dsInterval, metricAllDetailResponses);

                intervals.Add(dsInterval);

                // add additional hour total if not starting on the hour
                // For example : Afternoon segment start from 2:30 PM. We need to have 1 hourly interval from 2:30 PM -> 3:00 PM
                // and update prior hourly interval from 2:00PM -> 2:30 PM
                if (dsInterval.IntervalStart.Minute != 0)
                {
                    var splitTime = dsInterval.IntervalStart;
                    var latterHourlyInterval = BuildLatterHourlyInterval(intervals, splitTime);

                    intervals.Add(latterHourlyInterval);

                    // updated hourly interval for the first part of the hour
                    var priorHourlyInterval =
                        intervals.First(x => x.IntervalStart.Hour == splitTime.Hour &&
                                             x.IntervalType == MetricAllTimeSpanType.Hour);
                    Sum(priorHourlyInterval,
                        intervals.Where(
                            x => x.IntervalStart >= priorHourlyInterval.IntervalStart && x.IntervalStart < splitTime &&
                                 x.IntervalType == MetricAllTimeSpanType.Interval).ToList());
                }
            }
        }

        private MetricAllDetailResponse BuildLatterHourlyInterval(
            ICollection<MetricAllDetailResponse> intervals, DateTime splitTime)
        {
            var result = new MetricAllDetailResponse
            {
                IntervalType = MetricAllTimeSpanType.Hour,
                IntervalStart = splitTime
            };

            var fromTime = splitTime;
            var toTime = RoundDownToHour(fromTime.AddHours(1));
            Sum(result,
                intervals.Where(x => x.IntervalStart >= fromTime && x.IntervalStart < toTime
                                && x.IntervalType == MetricAllTimeSpanType.Interval).ToList());
            return result;
        }

        private void InsertForecast(ICollection<MetricAllDetailResponse> intervals, ForecastResponse forecast)
        {
            var fo = new MetricAllDetailResponse
            {
                IntervalType = MetricAllTimeSpanType.Forecast,
                IntervalStart = forecast.BusinessDayStart,
                LastYearSales = forecast.LastYearSales,
                ManagerSales = forecast.ManagerSales,
                LastYearTransactionCount = forecast.LastYearTransactionCount,
                ManagerTransactionCount = forecast.ManagerTransactionCount,
                SystemSales = 0.0m,
                SystemTransactionCount = 0.0d
            };

            intervals.Where(x => x.IntervalType == MetricAllTimeSpanType.Interval).ForEach(x =>
            {
                fo.SystemSales += x.SystemSales;
                fo.SystemTransactionCount += x.SystemTransactionCount;
            });

            intervals.Add(fo);
        }

        private class MetricAllDetailResponse : MetricDetailResponse, IConfigureAutoMapping
        {
            public MetricAllTimeSpanType IntervalType { get; set; }

            public static void ConfigureAutoMapping()
            {
                Mapper.CreateMap<MetricDetailResponse, MetricAllDetailResponse>();
            }
        }

        private ForecastMetricAllResponse GetForecastMetricAllResponse(ForecastMetricResponse response, ForecastResponse forecast, IList<DaySegmentResponse> daySegments, Int32? filterId = null)
        {
            var allResponse = new ForecastMetricAllResponse();

            var list = response.MetricDetails.Select(Mapper.Map<MetricDetailResponse, MetricAllDetailResponse>).ToList();

            if (list.Count > 0 || filterId.HasValue)
            {
                list = EnsureInterval(list, forecast.BusinessDayStart, forecast.BusinessDayEnd);

                foreach (var interval in list)
                    interval.IntervalType = MetricAllTimeSpanType.Interval;

                InsertHours(list, forecast.BusinessDayStart, forecast.BusinessDayEnd);
                var orderedDaySegments = daySegments.OrderBy(x => x.StartTime).ToList();
                InsertDaySegments(list, orderedDaySegments);
                InsertForecast(list, forecast);
               
                list = list.OrderBy(x => x.IntervalStart).ThenBy(x => x.IntervalType).ToList();

                AssignDetailsToAllResponse(allResponse, list, orderedDaySegments);
            }

            allResponse.Forecast = forecast;
            // not used yet?
            allResponse.ActualSales = new Decimal[0];
            allResponse.ActualTransactions = new Double[0];
            allResponse.ServiceTypes = new Int32[0];

            allResponse.NewManagerSales = new Decimal[0];
            allResponse.NewManagerTransactions = new Double[0];
            allResponse.NewManagerAdjustments = new Double[0];

            return allResponse;
        }

        private void AssignDetailsToAllResponse(ForecastMetricAllResponse allResponse, List<MetricAllDetailResponse> list, IList<DaySegmentResponse> daySegments)
        {
            if (list.Count > 0)
            {
                allResponse.IntervalTypes = new Int32[list.Count];
                allResponse.IntervalStarts = new DateTime[list.Count];
                allResponse.ManagerSales = new Decimal[list.Count];
                allResponse.ManagerTransactions = new Double[list.Count];
                allResponse.ManagerAdjustments = new Double[list.Count];
                allResponse.LastYearSales = new Decimal[list.Count];
                allResponse.LastYearTransactions = new Double[list.Count];
                allResponse.SystemSales = new Decimal[list.Count];
                allResponse.SystemTransactions = new Double[list.Count];

                allResponse.TypeIndexes = GetTypeIndexes(list);

                allResponse.DaySegments = daySegments;

                allResponse.DaySegmentIndexes = BuildDaySegmentIndexList(list, daySegments).ToArray();

                for (var i = 0; i < list.Count; i++)
                {
                    var md = list[i];
                    allResponse.IntervalTypes[i] = (Int32)md.IntervalType;
                    allResponse.IntervalStarts[i] = md.IntervalStart;
                    allResponse.ManagerSales[i] = md.ManagerSales;
                    allResponse.ManagerTransactions[i] = md.ManagerTransactionCount;
                    allResponse.LastYearSales[i] = md.LastYearSales;
                    allResponse.LastYearTransactions[i] = md.LastYearTransactionCount;
                    allResponse.SystemSales[i] = md.SystemSales;
                    allResponse.SystemTransactions[i] = md.SystemTransactionCount;
                }
            }
        }

        private int[][] GetTypeIndexes(List<MetricAllDetailResponse> list)
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

        private List<int> BuildDaySegmentIndexList(List<MetricAllDetailResponse> list, IList<DaySegmentResponse> daySegments)
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