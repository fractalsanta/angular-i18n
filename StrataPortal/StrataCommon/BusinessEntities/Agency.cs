using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Linq;
using System.Text;
using System.Data.Linq.Mapping;
using Agile.Diagnostics.Logging;
using Rockend.Common;
using Rockend.WebAccess.Common;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class Agency : IAgency
    {
        [Column(Name = "lAgencyID", IsPrimaryKey = true)]
        public int AgencyID { get; set; }

        [Column(Name = "sName")]
        public string Name { get; set; }

        [Column(Name = "sAddress1")]
        public string Address1 { get; set; }

        [Column(Name = "sAddress2")]
        public string Address2 { get; set; }

        [Column(Name = "sCity")]
        public string City { get; set; }

        [Column(Name = "sClientID")]
        public string ClientID { get; set; }

        [Column(Name = "sEmail")]
        public string Email { get; set; }

        [Column(Name = "sFax")]
        public string Fax { get; set; }

        [Column(Name = "sPhone")]
        public string Phone { get; set; }

        [Column(Name = "sPOBox")]
        public string POBox { get; set; }

        [Column(Name = "sPOCity")]
        public string POCity { get; set; }

        [Column(Name = "sPop3Password")]
        public string Pop3Password { get; set; }

        [Column(Name = "sPop3Server")]
        public string Pop3Server { get; set; }

        [Column(Name = "sPop3UserName")]
        public string Pop3UserName { get; set; }

        [Column(Name = "sPOPostcode")]
        public string PoPostcode { get; set; }

        [Column(Name = "sPORegion")]
        public string PoRegion { get; set; }

        [Column(Name = "sPostcode")]
        public string Postcode { get; set; }

        [Column(Name = "sPoTown")]
        public string PoTown { get; set; }

        [Column(Name = "sRegion")]
        public string Region { get; set; }

        [Column(Name = "sSMTPServer")]
        public string SmtpServer { get; set; }

        [Column(Name = "sTown")]
        public string Town { get; set; }

        [Column(Name = "sWebAccessClientID")]
        public string WebAccessClientID { get; set; }

        [Column(Name = "uWebAccessGUID")]
        public Guid? WebAccessGUID { get; set; }

        [Column(Name = "bWebAccessEnabled")]
        public string WebAccessEnabled { get; set; }

        [Column(Name = "sInterestCalculationUnit")]
        public string InterestCalculationUnit {get; set;}

        [Column(Name = "bCalculateInterestForGracePeriod")]
        public string CalculateInterestForGracePeriod { get; set; }

        public string FSLibraryID { get { return string.Empty; } set { value = value; } }

        public string FSOwnersCorpFolderID { get { return string.Empty; } set { value = value; } }

        public string FSLotsFolderID { get { return string.Empty; } set { value = value; } }

        public string FSPaymentID { get { return string.Empty; } set { value = value; } }

        /// <summary>
        /// Returns the WebAccessClientID as an int
        /// </summary>
        public int ApplicationKey
        {
            get
            {
                if (string.IsNullOrEmpty(WebAccessClientID))
                    return 0;
                return WebAccessClientID.AsInt();
            }
        }

        /// <summary>
        /// Safer way of checking if web access is enabled (because we have seen cases where the field does not exist in the DB and as a result throws an ex)
        /// </summary>
        /// <returns></returns>
        public bool IsWebAccessEnabled()
        {
            try
            {
                return Safe.Bool(WebAccessEnabled);
            }
            catch (Exception ex)
            {
                Logger.Warning("ERROR: IsWebAccessEnabled\r\n{0}", ex.Message);
                return false;
            }
        }
    }
}
