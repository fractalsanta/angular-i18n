using System;
using System.Globalization;
using System.Collections.Generic;

namespace Mx.Web.UI.Config.Helpers
{
    public static class DateHelper
    {
        public static DateTime? AsDateTime(this string value)
        {
            if (!value.HasValue())
            {
                return null;
            }

            DateTime result;
            if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out result))
            {
                return result;
            }
            return null;
        }

        public static bool IsBeetween(this DateTime value, DateTime start, DateTime end)
        {
            return value >= start && value <= end;
        }

        public static bool DateRangesOverlap(DateTime range1Start, DateTime range1End, DateTime range2Start, DateTime range2End)
        {
            return range1Start <= range2End && range1End >= range2Start;
        }

        public static bool Overlaps(this DateRange range1, DateRange range2)
        {
            return DateRangesOverlap(range1.Start, range1.End, range2.Start, range2.End);
        }

        public static DateRange Until(this DateTime date1, DateTime date2)
        {
            return new DateRange(date1, date2);
        }

        public class DateRange
        {
            public DateTime Start { get; set;}
            public DateTime End { get; set; }
            public double Weeks { get { return (End - Start).TotalDays / 7; } }
            public double Days { get { return (End - Start).TotalDays; } }
            public double Hours { get { return (End - Start).TotalHours; } }
            public double Minutes { get { return (End - Start).TotalMinutes; } }
            public double Seconds { get { return (End - Start).TotalSeconds; } }
            public int DaysRounded { get { return (int)Math.Ceiling(Days);  } }

            public IEnumerable<DateTime> AsEnumerable()
            {
                for (var day = Start.Date; day.Date <= End.Date; day = day.AddDays(1))
                    yield return day;
            }

            public DateRange()
            {
            }
            
            public DateRange(DateTime start, DateTime end) : this()
            {
                Start = start;
                End = end;
            }

            public DateRange(DateTime start, TimeSpan span) : this(start, start.Add(span)) { }

            public IEnumerable<DateRange> SplitByDate()
            {
                var dateRanges = new List<DateRange>();
                var intermediateDate = Start;

                while (intermediateDate < End)
                {
                    dateRanges.Add(new DateRange
                    {
                        Start = intermediateDate,
                        End = intermediateDate.Date.AddDays(1) > End ? End : intermediateDate.Date.AddDays(1)
                    });
                    intermediateDate = intermediateDate.Date.AddDays(1);               
                }
                return dateRanges;
            }
        }
    }
}