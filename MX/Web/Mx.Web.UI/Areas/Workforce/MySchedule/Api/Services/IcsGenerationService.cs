using System;
using System.Collections.Generic;
using System.Linq;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;
using NHibernate.Hql.Ast.ANTLR;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Services
{
    public class IcsGenerationService : IIcsGenerationService
    {
        // iCal/Outlook compatible ICS format
        private const string FILE_NEW_LINE = "\n\r";
        private const string FILE_BEGIN = "BEGIN:VCALENDAR";
        private const string FILE_END = "END:VCALENDAR";
        private const string FILE_PRODID = "PRODID:-//bobbin v0.1//NONSGML iCal Writer//EN";
        private const string FILE_VERSION = "VERSION:2.0";
        private const string FILE_CALSCALE = "CALSCALE:GREGORIAN";
        private const string FILE_METHOD = "METHOD:PUBLISH";
        private const string EVENT_BEGIN = "BEGIN:VEVENT";
        private const string EVENT_END = "END:VEVENT";
        private const string EVENT_DTSTART = "DTSTART:";
        private const string EVENT_DTEND = "DTEND:";
        private const string EVENT_DTSTAMP = "DTSTAMP:";
        private const string EVENT_UID = "UID:";
        private const string EVENT_CREATED = "CREATED:";
        private const string EVENT_DESCRIPTION = "DESCRIPTION:";
        private const string EVENT_LASTMODIFIED = "LAST-MODIFIED:";
        private const string EVENT_SEQUENCE = "SEQUENCE:0";
        private const string EVENT_STATUS = "STATUS:CONFIRMED";
        private const string EVENT_SUMMARY = "SUMMARY:";
        private const string EVENT_TRANSP = "TRANSP:OPAQUE";
        private const string EVENT_DATETIME_FORMAT = "yyyyMMddTHHmmssZ";
        private const string EVENT_UID_DATETIME_FORMAT = "_yyMMddHHmm";
        private const string EVENT_UID_SUFFIX = "@macromatix.com";
        
        public IcsFile GetNewFile(string name)
        {
            return new IcsFile
            {
                
                Begin = FILE_BEGIN,
                End = FILE_END,
                ProdId = FILE_PRODID,
                Version = FILE_VERSION,
                CalScale = FILE_CALSCALE,
                Method = FILE_METHOD
            };
        }

        public IcsEvent GetNewEvent(string name, string description, DateTime startTime, DateTime endTime, string uid = "")
        {
            return new IcsEvent()
            {
                EventName = name,
                EventDescription = description,
                Summary = EVENT_SUMMARY + name,
                Description = EVENT_DESCRIPTION + description,
                StartTime = startTime,
                DtStart = EVENT_DTSTART + startTime.ToUniversalTime().ToString(EVENT_DATETIME_FORMAT),
                EndTime = endTime,
                DtEnd = EVENT_DTEND + endTime.ToUniversalTime().ToString(EVENT_DATETIME_FORMAT),
                Begin = EVENT_BEGIN,
                End = EVENT_END,
                DtStamp = EVENT_DTSTAMP + DateTime.Now.ToUniversalTime().ToString(EVENT_DATETIME_FORMAT),
                Uid = EVENT_UID + (string.IsNullOrEmpty(uid) ? "" : uid) + startTime.ToString(EVENT_UID_DATETIME_FORMAT) + EVENT_UID_SUFFIX,
                Created = EVENT_CREATED + DateTime.Now.ToUniversalTime().ToString(EVENT_DATETIME_FORMAT),
                LastModified = EVENT_LASTMODIFIED + DateTime.Now.ToUniversalTime().ToString(EVENT_DATETIME_FORMAT),
                Sequence = EVENT_SEQUENCE,
                Status = EVENT_STATUS,
                Transp = EVENT_TRANSP
            };
        }

        public void AddEventToIcsFile(ref Models.IcsFile file, Models.IcsEvent @event)
        {
            file.Events.Add(@event);
        }

        public string SerialiseIcsFile(Models.IcsFile file)
        {
            var serEvents = new List<string>(file.Events.Count);
            file.Events.ToList().ForEach(e => serEvents.Add(SerialiseIcsEvent(e)));
            return String.Join(FILE_NEW_LINE, new[]
            {
                file.Begin,
                file.ProdId,
                file.Version,
                file.CalScale,
                file.Method,
                String.Join(FILE_NEW_LINE, serEvents.ToArray()),
                file.End
            });
        }
        
        public string SerialiseIcsEvent(IcsEvent @event)
        {
            return String.Join(FILE_NEW_LINE, new string[]
            {
                @event.Begin,
                @event.DtStart,
                @event.DtEnd,
                @event.DtStamp,
                @event.Uid,
                @event.Created,
                @event.Description,
                @event.LastModified,
                @event.Sequence,
                @event.Status,
                @event.Summary,
                @event.Transp,
                @event.End
            });
        }
    }
}