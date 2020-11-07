using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data;
using System.Data.Linq;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
	[DataContract]
	[Table]
	public class Contact
	{
	    public override string ToString()
	    {
	        return string.Format("[{0}] {1} {2} T:{3}", ContactID, FirstName ?? "", Name ?? "", ContactType ?? "");
	    }

	    [DataMember]
		[Column(Name = "lContactID", IsPrimaryKey=true)]
		public Int32 ContactID { get; set; }

		[DataMember]
		[Column(Name = "sContactType")]
		public string ContactType { get; set; }

		[DataMember]
		[Column(Name = "sName")]
		public string Name { get; set; }

		[DataMember]
		[Column(Name = "sFirstName")]
		public string FirstName { get; set; }

		[DataMember]
		[Column(Name = "sOtherNames")]
		public string OtherNames { get; set; }

		[DataMember]
		[Column(Name = "sTitle")]
		public string Title { get; set; }

		[DataMember]
		[Column(Name = "bBusinessContact")]
		public string BusinessContact { get; set; }

		[DataMember]
		[Column(Name = "sBuildingName")]
		public string BuildingName { get; set; }

		[DataMember]
		[Column(Name = "sStreetNumber")]
		public string StreetNumber { get; set; }

		[DataMember]
		[Column(Name = "sStreetName")]
		public string StreetName { get; set; }

		[DataMember]
		[Column(Name = "sTown")]
		public string Town { get; set; }

		[DataMember]
		[Column(Name = "sState")]
		public string State { get; set; }

		[DataMember]
		[Column(Name = "sPostcode")]
		public string Postcode { get; set; }

		[DataMember]
		[Column(Name = "sCountry")]
		public string Country { get; set; }

		[DataMember]
		[Column(Name = "sTelephone1")]
		public string Telephone1 { get; set; }

		[DataMember]
		[Column(Name = "sTelephone2")]
		public string Telephone2 { get; set; }

		[DataMember]
		[Column(Name = "sTelephone3")]
		public string Telephone3 { get; set; }

		[DataMember]
		[Column(Name = "sFax")]
		public string Fax { get; set; }

		[DataMember]
		[Column(Name = "sEmail")]
		public string Email { get; set; }

		[DataMember]
		[Column(Name = "sAMASStatus")]
		public string AMASStatus { get; set; }

		[DataMember]
		[Column(Name = "sBSP")]
		public string BSP { get; set; }

		[DataMember]
		[Column(Name = "lDPID")]
		public Int32 DPID { get; set; }

		[DataMember]
		[Column(Name = "sAMASBarcode")]
		public string AMASBarcode { get; set; }

		[DataMember]
		[Column(Name = "sPOBox")]
		public string POBox { get; set; }

		[DataMember]
		[Column(Name = "sFranchise")]
		public string Franchise { get; set; }

		[DataMember]
		[Column(Name = "sSalutation")]
		public string Salutation { get; set; }

		[DataMember]
		[Column(Name = "sWebsite")]
		public string Website { get; set; }

		[DataMember]
		[Column(Name = "sWebAccessUsername")]
		public string WebAccessUsername { get; set; }

		[DataMember]
		[Column(Name = "sWebAccessPassword")]
		public string WebAccessPassword { get; set; }

		[DataMember]
		[Column(Name = "bWebAccessEnabled")]
		public string WebAccessEnabled { get; set; }

		[DataMember]
		[Column(Name = "sEmail2")]
		public string Email2 { get; set; }

        [DataMember]
        public List<ContactDetail> Details { get; set; }

        /// <summary>
        /// Return the contacts address as a single comma seperated line 
        /// </summary>
        public string LineAddress
        {
            get
            {
                StringBuilder sb = new StringBuilder();

                if (POBox.Length > 0)
                    sb.Append(POBox + ", ");
                else
                {
                    if (StreetNumber.Length + StreetName.Length > 0)
                        sb.Append(String.Format("{0} {1}, ", StreetNumber, StreetName));
                }
                if (Town.Length > 0)
                    sb.Append(String.Format("{0}, ", Town));

                if (State.Length > 0)
                    sb.Append(String.Format("{0}, ", State));

                if (Postcode.Length > 0)
                    sb.Append(String.Format("{0}, ", Postcode));

                if (Country.Length > 0)
                    sb.Append(Country);

                string result = sb.ToString();
                if (result.Length > 0)
                {
                    if (!result.EndsWith(", "))
                        return result;
                    else
                        return result.Substring(0, result.Length - 2);
                }
                return result;
            }
        }

        /// <summary>
        /// Returns the contracts, contact details as a single line
        /// </summary>
        public string LinePhone
        {
            get{
                StringBuilder sb = new StringBuilder();

                if (Telephone1.Length > 0)
                    if (BusinessContact.Equals("Y"))
                        sb.Append(String.Format("Phone1: {0} ", Telephone1));
                    else
                        sb.Append(String.Format("Home: {0} ", Telephone1));

                if (Telephone2.Length > 0)
                    if (BusinessContact.Equals("Y"))
                        sb.Append(String.Format("Phone2: {0} ", Telephone2));
                    else
                        sb.Append(String.Format("work: {0} ", Telephone2));

                if (Telephone3.Length > 0)
                    sb.Append(String.Format("Mobile: {0} ", Telephone3));

                if (Fax.Length > 0)
                    sb.Append(String.Format("Fax: {0} ", Fax));

                if (Email.Length > 0)
                    sb.Append(String.Format("Email: {0}", Email));

                return sb.ToString();
            }
        }

	}
}
