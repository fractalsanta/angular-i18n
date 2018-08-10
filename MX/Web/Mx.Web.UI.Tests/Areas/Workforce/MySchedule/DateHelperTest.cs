using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;
using Mx.Web.UI.Config.Helpers;

namespace Mx.Web.UI.Tests.Areas.Workforce.MySchedule
{
    [TestClass]
    public class DateHelperTest
    {
        [TestMethod]
        public void Given_timeoff_request_within_one_day_When_requested_Then_1_date_range_created()
        {
            var timeOff = new TimeOffRequest
            {
                StartDateTime = new DateTime(2015, 7, 18, 12, 0, 0),
                EndDateTime = new DateTime(2015, 7, 18, 18, 0, 0)

            };

            var dateRange = timeOff.StartDateTime.Until(timeOff.EndDateTime);
            var dates = dateRange.SplitByDate().ToList();

            Assert.IsTrue(dates[0].Start == timeOff.StartDateTime && dates[0].End == timeOff.EndDateTime);
            Assert.AreEqual(dates.Count, 1);
        }

        [TestMethod]
        public void Given_1_timeoff_request_from_12pm_to_12pm_When_requested_Then_2_date_ranges_created()
        {
            var timeOff = new TimeOffRequest
            {
                StartDateTime = new DateTime(2015, 7, 18, 12, 0, 0),
                EndDateTime = new DateTime(2015, 7, 19, 12, 0, 0)

            };

            var dateRange = timeOff.StartDateTime.Until(timeOff.EndDateTime);
            var dates = dateRange.SplitByDate().ToList();

            Assert.IsTrue(dates[0].Start == timeOff.StartDateTime && dates[1].End == timeOff.EndDateTime);
            Assert.IsTrue(dates[1].Start == timeOff.EndDateTime.Date && dates[1].End == timeOff.EndDateTime, "Second Date Range supposed to start at 12 am and end at request end time");
            Assert.AreEqual(dates.Count, 2);
        }

        [TestMethod]
        public void Given_1_timeoff_request_from_12am_to_12am_When_requested_Then_1_date_range_created()
        {
            var timeOff = new TimeOffRequest
            {
                StartDateTime = new DateTime(2015, 7, 18, 0, 0, 0),
                EndDateTime = new DateTime(2015, 7, 19, 0, 0, 0)

            };

            var dateRange = timeOff.StartDateTime.Until(timeOff.EndDateTime);
            var dates = dateRange.SplitByDate().ToList();

            Assert.IsTrue(dates[0].Start == timeOff.StartDateTime && dates[0].End == timeOff.EndDateTime);
            Assert.AreEqual(dates.Count, 1);
        }

        [TestMethod]
        public void Given_2and_a_half_days_timeoff_request_When_requested_Then_3_date_ranges_created()
        {
            var timeOff = new TimeOffRequest
            {
                StartDateTime = new DateTime(2015, 7, 18, 12, 1, 0),
                EndDateTime = new DateTime(2015, 7, 20, 8, 0, 0)

            };

            var dateRange = timeOff.StartDateTime.Until(timeOff.EndDateTime);
            var dates = dateRange.SplitByDate().ToList();

            Assert.IsTrue(dates[0].Start == timeOff.StartDateTime && dates[0].End == timeOff.StartDateTime.Date.AddDays(1), "First Date Range supposed to start at request time and end at 12am next date");            
            Assert.IsTrue(dates[2].Start == timeOff.EndDateTime.Date && dates[2].End == timeOff.EndDateTime, "Last Date Range supposed to start at 12 am and end at request end time");
            
            Assert.AreEqual(dates.Count, 3);
        }
    }
}
