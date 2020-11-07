using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using Agile.Diagnostics.Logging;
using Rockend.WebAccess.Common.Transport;
using Rockend.WebAccess.Common.Helpers;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    [Serializable]
    public class ScheduleDto
    {
        #region Private data
        private DateTime? nextRun = null;
        private DateTime? currentTimeDate = null;
        private bool? staggerExecution = null;
        private static Random Random = new Random();
        #endregion

        #region Properties
        [DataMember]
        public int ScheduleId { get; set; }

        [DataMember]
        public int ServiceKey { get; set; }

        [DataMember]
        public int ApplicationKey { get; set; }

        [DataMember]
        public string ActionName { get; set; }

        [DataMember]
        public DateTime? StartAt { get; set; }

        [DataMember]
        public int DelayQuantity { get; set; }

        [DataMember]
        public string DelayType { get; set; }  // "ms", "s", "m", "h", "d", "wk", "mn", "y"

        [DataMember]
        public DateTime? LastRun { get; set; }

        [DataMember]
        public List<ScheduleParameterDto> Parameters { get; set; }

        [DataMember]
        public bool IsStatic { get; set; }

        [DataMember]
        public bool Hidden { get; set; }

        // Adding the order value here will ensure that this member will be serialised after the members with no order specified
        // this has been done to ensure that this change will not break existing clients that are using this service.
        [DataMember(Order = 0)]
        public bool IsActive { get; set; }

        public DateTime NextRun
        {
            get
            {
                if (nextRun == null)
                    nextRun = CalculateNextRun();

                return nextRun.Value;
            }
        }

        /// <summary>
        /// Explicitly set the next run date. This is for testing use only.
        /// </summary>
        public void SetNextRunForTesting(DateTime testDate)
        {
            nextRun = testDate;
        }
        public DateTime Now 
        {
            get { return currentTimeDate ?? DateTime.Now; }
        }

        public RockendApplication Application { get; set; }

        /// <summary>
        /// Determines whether a schedule should execute at it's scheduled time, or at a random interval after.
        /// If a static schedule executes on 4000 clients at the same time it'd be a big hit for our server.
        /// </summary>
        public bool StaggerExecution
        {
            get
            {
                if (this.staggerExecution.HasValue)
                    return this.staggerExecution.Value;

                ScheduleParameterDto parameter = this.Parameters.FirstOrDefault(p => p.Name.Equals("StaggerExecution"));

                // If paramerer not present, cache & return.
                if (parameter == null)
                {
                    this.staggerExecution = false;
                    return false;
                }
                else
                {
                    // else parse bool from parameter, cache & return.
                    this.staggerExecution = bool.Parse(parameter.Value);
                    return this.staggerExecution.Value;
                }
            }
        }

        #region Interval
        public TimeSpan Interval
        {
            get
            {
                switch (DelayType)
                {
                    case "ms":
                        return new TimeSpan(0, 0, 0, 0, DelayQuantity);

                    case "second":
                    case "s":
                        return new TimeSpan(0, 0, 0, DelayQuantity);

                    case "minute":
                    case "m":
                        return new TimeSpan(0, 0, DelayQuantity, 0);

                    case "hour":
                    case "h":
                        return new TimeSpan(0, DelayQuantity, 0, 0);

                    case "day":
                    case "d":
                        return new TimeSpan(DelayQuantity, 0, 0, 0);

                    case "week":
                    case "wk":
                        return new TimeSpan(DelayQuantity * 7, 0, 0, 0);

                    case "month":
                    case "mn":
                        return DateTime.Now.AddMonths(1).Subtract(DateTime.Now);

                    default:
                        return DateTime.Now.AddYears(1).Subtract(DateTime.Now);
                }
            }
        }
        #endregion
        #endregion

        #region Constructors
        public ScheduleDto(DateTime? currentDate = null)
        {
            Parameters = new List<ScheduleParameterDto>();
            currentTimeDate = currentDate;
        }
        #endregion

        #region Private methods
        private DateTime CalculateNextRun()
        {
            var baseTime = StartAt ?? Now;
            var executionTimeOfDay = new DateTime(Now.Year, Now.Month, Now.Day, baseTime.Hour, baseTime.Minute, baseTime.Second);

            // if scheduled for weekly execution, find the day of week parameter
            if (DelayType == "weekly" || DelayType == "wk")
            {
                ScheduleParameterDto dayOfWeekParam = Parameters.FirstOrDefault(d => d.Name.ToLower().Equals("dayofweek"));
                string dayOfWeekForExecution = dayOfWeekParam == null ? baseTime.DayOfWeek.ToString() : dayOfWeekParam.Value;

                // if a parameter exists with the day of week...
                if (dayOfWeekForExecution != null)
                {
                    var executionDay = (DayOfWeek)Enum.Parse(typeof(DayOfWeek), dayOfWeekForExecution.UppercaseFirst());
                    double daysToExecution = 0;

                    // if task is scheduled for a day later in the week.
                    if (executionDay > Now.DayOfWeek)
                    {
                        daysToExecution = (executionDay - Now.DayOfWeek);
                    }
                    else
                    {
                        // if scheduled for execution a day prior in the week, calculate difference & subtract from 7 (to see when execution is due)
                        daysToExecution = 7 - (Now.DayOfWeek - executionDay);
                    }

                    executionTimeOfDay = executionTimeOfDay.AddDays(daysToExecution);
                }
            }
            if (DelayType == "day")
            {
                var result = baseTime;
                while (result < Now)
                {
                    result = result.AddDays(DelayQuantity);
                }
                executionTimeOfDay = result;
            }
            if (DelayType == "hour")
            {
                //create a new date with the basetime time and yesterdays date
                var result = executionTimeOfDay.AddDays(-1);
                //loop while expected execution time is in the past 
                while (result < Now)
                {
                    result = result.AddHours(DelayQuantity);
                }
                executionTimeOfDay= result;
            }
            // if scheduled for monthly execution, find the day of week parameter
            if (this.DelayType == "monthly" || this.DelayType == "mn")
            {
                ScheduleParameterDto dayOfMonthParam = Parameters.FirstOrDefault(d => d.Name.ToLower().Equals("dayofmonth"));
                var dayOfMonthForExecution = 0;
                if (dayOfMonthParam == null || !int.TryParse(dayOfMonthParam.Value, out dayOfMonthForExecution))
                {
                    dayOfMonthForExecution = baseTime.Day;
                }
                //it hasnt happened this month yet 
                if (dayOfMonthForExecution >= Now.Day)
                {
                    //if the day of month is set to something bigger then the actuall days on the month it will execute on the last day of the month
                    dayOfMonthForExecution = Math.Min(dayOfMonthForExecution,DateTime.DaysInMonth(Now.Year, Now.Month));
                    executionTimeOfDay = new DateTime(Now.Year, Now.Month, dayOfMonthForExecution
                    , baseTime.Hour, baseTime.Minute, baseTime.Second);
                }
                //it allready happened this month
                else
                {
                    //if the day of month is set to something bigger then the actuall days on the month it will execute on the last day of the month
                    dayOfMonthForExecution = Math.Min(dayOfMonthForExecution, DateTime.DaysInMonth(Now.AddMonths(1).Year, Now.AddMonths(1).Month));
                    executionTimeOfDay = new DateTime(Now.AddMonths(1).Year, Now.AddMonths(1).Month, dayOfMonthForExecution, baseTime.Hour, baseTime.Minute, baseTime.Second);
                }
            }

            if (StaggerExecution)
            {
                // Get the staggered execution interval - number of minutes after specified runtime.
                ScheduleParameterDto parameter = Parameters.FirstOrDefault(p => p.Name.Equals("StaggerExecutionIntervalMins"));

                int numberOfMinsInterval = 120; // default to 2 hours.

                if (parameter != null)
                {
                    // Failing to parse, back default.
                    int.TryParse(parameter.Value, out numberOfMinsInterval);
                }
                int randomNumber = Random.Next(0, numberOfMinsInterval);
                executionTimeOfDay = executionTimeOfDay.AddMinutes(randomNumber);
            }

            return executionTimeOfDay;
        }
        #endregion

        /// <summary>
        /// created to use in a test to know if the method was called
        /// </summary>
        public event EventHandler UpdateNextRunDateCalled;

        public DateTime UpdateNextRunDate()
        {
            var current = nextRun;
            nextRun = CalculateNextRun();
            if (UpdateNextRunDateCalled != null)
                UpdateNextRunDateCalled(this, EventArgs.Empty);

            Logger.Info("UpdateNextRunDate: [{0}] from:{1} to:{2}", ActionName ?? "--", current, nextRun);

            return nextRun.Value;
        }

        public override string ToString()
        {
            return string.Concat(ActionName, ", ", 
                ApplicationKey, ", ",
                NextRun.ToShortDateString(), " ", this.NextRun.ToString("HH:mm"), ", ",
                IsStatic ? "Static" : "Non-Static", ", ", 
                StaggerExecution ? "Staggered" : "Non-Staggered");
        }
    }
}
