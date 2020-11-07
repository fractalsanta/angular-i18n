using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Helpers;
using System;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class ExecutiveMemberModel
    {
        public static ExecutiveMemberModel CreateExecutiveMemberModel(UserSession userSession, ExecutiveResponse response, int selectedIndex)
        {
            var model = new ExecutiveMemberModel();
            model.CurrentExecutiveMember = userSession.ExecutiveMemberNames[selectedIndex];
            model.CurrentExecutiveMemberIndex = selectedIndex;
            model.ExecutiveMemberContact = response.Contact;
            model.ExecutiveInfo = response.ExecutiveInfo;
            model.UserSession = userSession;

            model.ReceivesReports = response.ExecutiveMember.ReceiveReports.ToBoolean() ? "Yes" : "No";
            model.Position = response.ExecutivePosition.Name;

            model.MemberName = userSession.ExecutiveMemberNamesAndAddress[selectedIndex].Name;
            model.MemberAddress = userSession.ExecutiveMemberNamesAndAddress[selectedIndex].Address;

            model.BodyCorporateName = response.OwnersCorporation.BodyCorporateName;
            model.PlanNumber = response.OwnersCorporation.PlanNumber;

            model.AddressLine1 = response.MainOCAddress.BuildingName;
            model.AddressLine2 = string.Concat(response.MainOCAddress.StreetNumberPrefix, response.MainOCAddress.StreetNumber <= 0 ? string.Empty : response.MainOCAddress.StreetNumber.ToString(), 
                    response.MainOCAddress.StreetNumberSuffix, " ", response.MainOCAddress.Street);
            model.AddressLine3 = string.Concat(response.MainOCAddress.Town, " ",
                    response.MainOCAddress.State, " ",
                    response.MainOCAddress.Postcode);
            
            return model;
        }

        public static string CreateOwnersCorpContact(OwnersCorporation ownersCorporation, StreetAddress streetAddress)
        {
            var sb = new StringBuilder();
            sb.AddHeading("Name", ownersCorporation.BodyCorporateName)
                .AddHeading("Plan Number", ownersCorporation.PlanNumber)
                .AddEmptyLine()
                .AddHeadingOnly("Property Address:")
                .AddLine(streetAddress.BuildingName)
                .AddLine(
                    streetAddress.StreetNumberPrefix,
                    streetAddress.StreetNumber <= 0 ? string.Empty : streetAddress.StreetNumber.ToString(),
                    streetAddress.StreetNumberSuffix,
                    streetAddress.Street)
                .AddLine(
                    streetAddress.Town,
                    streetAddress.State,
                    streetAddress.Postcode); // .AddHeading("Manager", ownersCorporation.?)

            return sb.ToString().Replace(Environment.NewLine, "<br />");
        }

        public DropdownItem CurrentExecutiveMember { get; private set; }

        public int CurrentExecutiveMemberIndex { get; private set; }

        public Contact ExecutiveMemberContact { get; private set; }

        // public string ExecutiveMemberOther { get; private set; }

        public List<ExecutiveInfo> ExecutiveInfo { get; private set; }

        public UserSession UserSession { get; private set; }

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string AddressLine3 { get; set; }

        public string PlanNumber { get; set; }

        public string BodyCorporateName { get; set; }

        public string Position { get; set; }

        public string ReceivesReports { get; set; }

        public string MemberName { get; set; }

        public string MemberAddress { get; set; }
    }
}
