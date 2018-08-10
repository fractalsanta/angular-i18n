using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Helpers;
using System;
using System.Web;
using Agile.Diagnostics.Logging;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class LotOwnerModel : ModelBase
    {
        public static LotOwnerModel CreateLotOwnerModel(UserSession userSession, LotResponse response, int index)
        {
            LotOwnerModel model = new LotOwnerModel();
            
            if (response.OwnerContact != null)
            {
                model.MainContactIsBusinessContact = response.OwnerContact.BusinessContact.ToBoolean();
                model.MainContactName = string.Concat(response.OwnerContact.Title, " ", response.OwnerContact.FirstName, " ", response.OwnerContact.OtherNames, response.OwnerContact.Name);
                model.MainContactBuildingName = response.OwnerContact.BuildingName;
                model.MainContactPOBox = response.OwnerContact.POBox;
                model.MainContactStreetNumber = response.OwnerContact.StreetNumber;
                model.MainContactStreetName = response.OwnerContact.StreetName;
                model.MainContactTown = response.OwnerContact.Town;
                model.MainContactState = response.OwnerContact.State;
                model.PostCode = response.OwnerContact.Postcode;
                model.MainContactCountry = response.OwnerContact.Country;
                model.MainContactHomePhone = response.OwnerContact.Telephone1;
                model.MainContactWorkPhone = response.OwnerContact.Telephone2;
                model.MainContactMobile = response.OwnerContact.Telephone3;
                model.MainContactWebsite = response.OwnerContact.Website;
            }

            if (response.AgencyContact != null)
            {
                model.MainContactIsBusinessContact = response.AgencyContact.BusinessContact.ToBoolean();
                model.MainContactName = string.Concat(response.AgencyContact.Title, " ", response.AgencyContact.FirstName, " ", response.AgencyContact.OtherNames, response.AgencyContact.Name);
                model.MainContactBuildingName = response.AgencyContact.BuildingName;
                model.MainContactPOBox = response.AgencyContact.POBox;
                model.MainContactStreetNumber = response.AgencyContact.StreetNumber;
                model.MainContactStreetName = response.AgencyContact.StreetName;
                model.MainContactTown = response.AgencyContact.Town;
                model.MainContactState = response.AgencyContact.State;
                model.PostCode = response.AgencyContact.Postcode;
                model.MainContactCountry = response.AgencyContact.Country;
                model.MainContactHomePhone = response.AgencyContact.Telephone1;
                model.MainContactWorkPhone = response.AgencyContact.Telephone2;
                model.MainContactMobile = response.AgencyContact.Telephone3;
                model.MainContactWebsite = response.AgencyContact.Website;
            }
            
            model.BodyCorporateName = response.OwnerCorp.BodyCorporateName;
            model.PlanNumber = response.OwnerCorp.PlanNumber;

            model.AddressLine1 = response.MainOCAddress.BuildingName;
            model.AddressLine2 = string.Concat(response.MainOCAddress.StreetNumberPrefix, response.MainOCAddress.StreetNumber <= 0 ? string.Empty : response.MainOCAddress.StreetNumber.ToString(),
                    response.MainOCAddress.StreetNumberSuffix, " ", response.MainOCAddress.Street);
            model.AddressLine3 = string.Concat(response.MainOCAddress.Town, " ", 
                    response.MainOCAddress.State, " ", 
                    response.MainOCAddress.Postcode);
            
            model.AgentContact = response.AgencyContact;
            // the 'LevyContact' is actually the TenantContact, can't change because need to be backwards compatible
            model.LevyContact = response.LevyContact;
            model.MainContact = response.OwnerContact;

            if (response.Lot75 != null)
            {
                // DocumentDistributions only works with Strata Master 7.5 and above
                model.ShowDocumentDisributions = true;

                if (response.DistributionDetails != null)
                {
                    model.DocumentDistributions = new List<DocumentDistributionModel>();
                    foreach (var dd in response.DistributionDetails)
                    {
                        model.DocumentDistributions.Add(new DocumentDistributionModel()
                        {
                            Type = dd.Type,
                            Method = dd.DeliveryType == "E" ? "Email" : "Print",
                            Recipient = dd.Name,
                            Value = dd.DeliveryType == "E" ? dd.Email : "Print"
                        });
                    }
                }
            }

            model.NameOnTitle = response.OwnerDetail.NameOnTitle;

            model.FinancialEnteredDate = response.OwnerDetail.DateOfEntry;
            model.FinancialPurchasedDate = response.OwnerDetail.Purchase;
            model.FinancialPaidTo = response.PaidTo;
            model.HidePaidTo = response.HidePaidTo;

            model.FinancialLastReceiptDate = response.LastReceiptDate;
            model.FinancialLastReceiptAmount = response.LastReceiptAmount;
            model.FinancialLastReceiptRecordNo = response.LastReceiptRecordNo;
            
            model.CurrentLot = userSession.LotNames[index];
            model.CurrentLotIndex = index;
            
            model.OwnersCorpDetails = ExecutiveMemberModel.CreateOwnersCorpContact(response.OwnerCorp, response.MainOCAddress);
            model.OwnershipType = CreateOwnershipType(response.OwnerDetail);
            model.UserSession = userSession;
            
            try
            {
                model.HasPropertyPhoto = !string.IsNullOrWhiteSpace(response.PropertyPhoto);
                HttpContext.Current.Session["PropertyPhoto"] = response.PropertyPhoto;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "CACHE error adding property photo");
            }
            
            return model;
        }

        private static void ConstructDocumentDistrubutions(LotOwnerModel model, Contact contact, string type)
        {
            var name = string.Concat(contact.Title, " ", contact.FirstName, " ", contact.OtherNames, " ", contact.Name);

            if (!string.IsNullOrEmpty(contact.Email))
                model.DocumentDistributions.Add(new DocumentDistributionModel()
                {
                    Type = type,
                    Method = "Email",
                    Recipient = name,
                    Value = contact.Email
                });

            foreach (var cd in contact.Details.Where(d => d.EmailMeetingDocs == true && d.Type.StartsWith("Email")))
            {
                model.DocumentDistributions.Add(new DocumentDistributionModel()
                {
                    Type = type,
                    Method = "Email",
                    Recipient = name,
                    Value = cd.Value
                });
            }
        }

        public static string CreateOwnershipType(IOwner owner)
        {
            StringBuilder sb = new StringBuilder();
            if (owner.OwnerType == "I")
            {
                sb.Append("Private".Strong());
            }
            else
            {
                sb.Append("Company".Strong());
            }
            if (!string.IsNullOrEmpty(owner.CompanyNominee))
            {
                sb.Append(" (Nominee: ")
                    .Append(owner.CompanyNominee)
                    .Append(")");
            }
            return sb.ToHtml();
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

        // Contact Details:
        public bool MainContactIsBusinessContact { get; set; }
        public string MainContactName { get; set; }
        public string MainContactBuildingName { get; set; }
        public string MainContactStreetNumber { get; set; }
        public string MainContactStreetName { get; set; }
        public string MainContactTown { get; set; }
        public string MainContactState { get; set; }
        public string MainContactPostCode { get; set; }
        public string MainContactCountry { get; set; }
        public string MainContactHomePhone { get; set; }
        public string MainContactWorkPhone { get; set; }
        public string MainContactMobile { get; set; }
        public string MainContactEmail { get; set; }
        public string MainContactWebsite { get; set; }

        // Agent contact details:
        public string AgentContactName { get; set; }
        public string AgentContactAddressLine1 { get; set; }
        public string AgentContactAddressline2 { get; set; }
        public string AgentContactSuburb { get; set; }
        public string AgentContactState { get; set; }
        public string AgentContactPostCode { get; set; }
        public string AgentContactPhone { get; set; }
        public string AgentContactFax { get; set; }
        public string AgentContactEmail { get; set; }

        // Tenant contact details:
        public string TenantContactName { get; set; }
        public string TenantContactAddressLine1 { get; set; }
        public string TenantContactAddressline2 { get; set; }
        public string TenantContactSuburb { get; set; }
        public string TenantContactState { get; set; }
        public string TenantContactPostCode { get; set; }
        public string TenantContactWorkPhone { get; set; }
        public string TenantContactEmail { get; set; }

        // Financial details:
        public string RecordNumber { get; set; }

        // Dates:
        public DateTime FinancialEnteredDate { get; set; }
        public DateTime FinancialPurchasedDate { get; set; }
        public string FinancialPaidTo { get; set; }
        public string FinancialLastReceiptDate { get; set; }
        public string FinancialLastReceiptAmount { get; set; }
        public string FinancialLastReceiptRecordNo { get; set; }

        public DropdownItem CurrentLot { get; private set; }

        public int CurrentLotIndex { get; private set; }

        public Contact AgentContact { get; private set; }
        public Contact LevyContact { get; private set; }
        public Contact MainContact { get; private set; }

        public bool UseOwnersLevyEmail { get; private set; }
        public bool UseAgentsLevyEmail { get; private set; }
        public bool UseTenantsLevyEmail { get; private set; }

        public bool UseOwnersNoticeEmail { get; private set; }
        public bool UseAgentsNoticeEmail { get; private set; }
        public bool UseTenantsNoticeEmail { get; private set; }

        public bool UseOwnersCorrespondenceEmail { get; private set; }
        public bool UseAgentsCorrespondenceEmail { get; private set; }
        public bool UseTenantsCorrespondenceEmail { get; private set; }

        public bool ShowDocumentDisributions { get; set; }
        public List<DocumentDistributionModel> DocumentDistributions { get; set; }

        public List<ContactDetail> ContactDetails { get; set; }

        public string NameOnTitle { get; private set; }

        public string OwnerOccupied { get; private set; }

        public string OwnersCorpDetails { get; private set; }

        public string OwnershipType { get; private set; }

        public UserSession UserSession { get; private set; }

        public string MainContactPOBox { get; set; }

        public bool HasPropertyPhoto { get; set; }

        public bool HidePaidTo { get; set; }
    }
}
