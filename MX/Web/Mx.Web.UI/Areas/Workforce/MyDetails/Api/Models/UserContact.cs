using System;
using System.ComponentModel;
using AutoMapper;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared.Contracts;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;
using Mx.Foundation.Services.Contracts.Requests;

namespace Mx.Web.UI.Areas.Workforce.MyDetails.Api.Models
{
    public class UserContact : IConfigureAutoMapping
    {
        public String FirstName { get; set; }
        public String LastName { get; set; }

        public String Phone { get; set; }
        public String MobilePhone { get; set; }

        public String Email { get; set; }

        public String Address1 { get; set; }
        public String Address2 { get; set; }
        public String City { get; set; }
        public String State { get; set; }
        public String PostCode { get; set; }

        public String MailAddress1 { get; set; }
        public String MailAddress2 { get; set; }
        public String MailCity { get; set; }
        public String MailState { get; set; }
        public String MailPostCode { get; set; }

        public String EmergencyContactName { get; set; }
        public String EmergencyContactRelationship { get; set; }
        public String EmergencyContactPhone { get; set; }
        public String EmergencyContactMobile { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<UserContactResponse, UserContact>();
            Mapper.CreateMap<UserContact, UserContactRequest>();
        }
    }
}