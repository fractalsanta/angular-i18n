using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    public interface IAgency
    {
        int AgencyID { get; set; }

        string Name { get; set; }

        string Address1 { get; set; }

        string Address2 { get; set; }

        string City { get; set; }

        string ClientID { get; set; }

        string Email { get; set; }

        string Fax { get; set; }

        string Phone { get; set; }

        string POBox { get; set; }

        string POCity { get; set; }

        string Pop3Password { get; set; }

        string Pop3Server { get; set; }

        string Pop3UserName { get; set; }

        string PoPostcode { get; set; }

        string PoRegion { get; set; }

        string Postcode { get; set; }

        string PoTown { get; set; }

        string Region { get; set; }

        string SmtpServer { get; set; }

        string Town { get; set; }

        string WebAccessClientID { get; set; }

        Guid? WebAccessGUID { get; set; }

        string WebAccessEnabled { get; set; }

        string FSLibraryID { get; set; }

        string FSOwnersCorpFolderID { get; set; }

        string FSLotsFolderID { get; set; }

        string FSPaymentID { get; set; }

        string InterestCalculationUnit { get; set; }

        string CalculateInterestForGracePeriod { get; set; }

        bool IsWebAccessEnabled();
    }
}
