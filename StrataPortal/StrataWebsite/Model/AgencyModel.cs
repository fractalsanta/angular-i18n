using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using System.Text;
using Rockend.iStrata.StrataWebsite.Helpers;

namespace Rockend.iStrata.StrataWebsite.Model
{
    [Serializable]
    public class AgencyModel
    {
        public static AgencyModel CreateAgencyModel(AgencyResponse response)
        {
            AgencyModel model = new AgencyModel();
            model.AddressLine1 = response.AgencyInfo.Address1;
            model.AddressLine2 = response.AgencyInfo.Address2;
            model.City = response.AgencyInfo.City;
            model.Email = response.AgencyInfo.Email;
            model.Phone = response.AgencyInfo.Phone;
            model.Fax = response.AgencyInfo.Fax;
            model.Name = response.AgencyInfo.Name;
            model.PostCode = response.AgencyInfo.Postcode;
            model.Region = response.AgencyInfo.Region;
            model.Town = response.AgencyInfo.Town;

            return model;
        }

        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string Region { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
    }
}
