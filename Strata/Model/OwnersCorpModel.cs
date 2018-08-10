using System;
using System.Collections.Generic;
using System.Web;
using Agile.Diagnostics.Logging;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using Rockend.iStrata.StrataCommon.Response;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class OwnersCorpModel : ModelBase
    {
        public static OwnersCorpModel CreateOwnersCorpModel(UserSession userSession, OwnerResponse response, int index)
        {
            var model = new OwnersCorpModel();
            model.CurrentOwnersCorp = userSession.OwnersCorpNames[index];
            model.CurrentOwnersCorpIndex = index;
            model.EntitlementSets = response.LevyEntitlementList;
            model.LotEntitlements = response.LotEntitlementList;
            
            model.UserSession = userSession;

            model.BodyCorporateName = response.OwnersCorporation.BodyCorporateName;
            model.PlanNumber = response.OwnersCorporation.PlanNumber;

            model.AddressLine1 = response.MainOCAddress.BuildingName;
            model.AddressLine2 = string.Concat(response.MainOCAddress.StreetNumberPrefix, response.MainOCAddress.StreetNumber <= 0 ? string.Empty : response.MainOCAddress.StreetNumber.ToString(), 
                    response.MainOCAddress.StreetNumberSuffix, " ", response.MainOCAddress.Street);
            model.AddressLine3 = string.Concat(response.MainOCAddress.Town, " ",
                    response.MainOCAddress.State, " ",
                    response.MainOCAddress.Postcode);

            model.NumberOfLots = response.LotEntitlementList.Count.ToString();
            model.LastIssuedlevyNotice = response.OwnersCorporation.LastLevyNotice.ToShortDateString();
            model.NormalLevyFrequency = GetNormalLevyFrequency(response.OwnersCorporation);
            model.LevyDiscountRate = response.OwnersCorporation.LevyDiscount.ToString("F2");
            model.LevyInterestRate = response.OwnersCorporation.LevyInterest.ToString("F2");
            model.InterestFreePeriod = string.Concat(response.OwnersCorporation.InterestFreePeriods.ToString(),
                    " ", GetInterestFreeUnit(response.OwnersCorporation.InterestFreePeriodUnit, response.OwnersCorporation.InterestFreePeriods));

            model.FinancialYearEnd = response.OwnersCorporation.FinancialYearEnd.ToShortDateString();
            model.ABN = response.OwnersCorporation.ABN;

            model.ShowABN = !string.IsNullOrWhiteSpace(model.ABN);

            model.GSTStatus = response.OwnersCorporation.GSTstatus == "R" ? "Registered" : "Not Registered";
            model.TFN = response.OwnersCorporation.TaxFileNumber;
            model.TaxYearEnd = response.OwnersCorporation.TaxYearEnd.ToShortDateString();
            model.ShowOwnerNameInEntitlements = response.ShowOwnerNameInEntitlements;
            model.ManagerName = response.ManagerName;
            model.ManagerEmail = response.ManagerEmail;
            model.HasManagerPhoto = !string.IsNullOrWhiteSpace(response.ManagerPhoto);


            try
            {
                HttpContext.Current.Session["ManagerPhoto"] = response.ManagerPhoto;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "CACHE error adding manager photo");
            }

            return model;
        }

        private static string GetInterestFreeUnit(string p, int quantity)
        {
            string result = p;
            switch (p.ToLower())
            {
                case "d":
                    result = quantity > 1 ? "Days" : "Day";
                    break;
                case "m":
                    result = quantity > 1 ? "Months" : "Month";
                    break;
                case "y":
                    result = quantity > 1 ? "Years" : "Year";
                    break;
                case "w":
                    result = quantity > 1 ? "Weeks" : "Week";
                    break;
                case "q":
                    result = quantity > 1 ? "Quarters" : "Quarter";
                    break;
            }
            return result;
        }

        // Portfolio fields:
        public string BodyCorporateName { get; set; }
        public string PlanNumber { get; set; }

        // Address fields:
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string Suburb { get; set; }
        public string State { get; set; }
        public string PostCode { get; set; }

        // management fields:
        public string NumberOfLots { get; set; }
        public string LastIssuedlevyNotice { get; set; }
        public string NormalLevyFrequency { get; set; }
        public string LevyDiscountRate { get; set; }
        public string LevyInterestRate { get; set; }
        public string InterestFreePeriod { get; set; }

        public string FinancialYearEnd { get; set; }
        public string ABN { get; set; }
        public string GSTStatus { get; set; }
        public string TFN { get; set; }
        public string TaxYearEnd { get; set; }

        private static string GetNormalLevyFrequency(OwnersCorporation ownersCorporation)
        {
            string freqency;
            switch (ownersCorporation.LevyFrequency)
            {
                case "M":
                    freqency = "Monthly";
                    break;
                case "Q":
                    freqency = "Quarterly";
                    break;
                case "S":
                    freqency = "Sixmonthly";
                    break;
                case "Y":
                    freqency = "Yearly";
                    break;
                case "O":
                    freqency = "Once off";
                    break;
                default:
                    freqency = string.Empty;
                    break;
            }
            return freqency;
        }

        public DropdownItem CurrentOwnersCorp { get; private set; }
        public int CurrentOwnersCorpIndex { get; private set; }
        public UserSession UserSession { get; private set; }
        public List<LevyEntitlement> EntitlementSets { get; private set; }
        public List<LotEntitlements> LotEntitlements { get; private set; }
        public bool ShowABN { get; set; }
        public bool ShowOwnerNameInEntitlements { get; set; }

        public bool HasManagerPhoto { get; set; }
        public string ManagerName { get; set; }
        public string ManagerEmail { get; set; }
    }
}
