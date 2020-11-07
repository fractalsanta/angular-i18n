using System;
using System.Drawing.Imaging;
using System.Runtime.Serialization;
using Communicator.ImageHelper;

namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class AgentContentDTO
    {
        #region Properties
        [DataMember]
        public int AgentContentId { get; set; }

        [DataMember]
        public int AgencyAccessId { get; set; }

        [DataMember]
        public int AgencyApplicationId { get; set; }

        /// <summary>
        /// Banner image. No longer saved to the DB, only saved to storage (still very much required on the DTO though!)
        /// </summary>
        [DataMember]
        public byte[] Banner { get; set; }

        /// <summary>
        /// Banner Footer image. No longer saved to the DB, only saved to storage (still very much required on the DTO though!)
        /// </summary>
        [DataMember]
        public byte[] FooterBanner { get; set; }

        [DataMember]
        public string FooterBannerUrl { get; set; }

        [DataMember]
        public byte[] TopImage { get; set; }

        [DataMember]
        public byte[] MiddleImage { get; set; }

        [DataMember]
        public byte[] BottomRightImage { get; set; }

        [DataMember]
        public string LoginPageTopText { get; set; }

        [DataMember]
        public string AgencyUrl { get; set; }

        [DataMember]
        public DateTime CreatedDate { get; set; }

        [DataMember]
        public DateTime? UpdatedDate { get; set; }

        [DataMember]
        public bool OwnerReportsOn { get; set; }

        [DataMember]
        public bool IncExpReportsOn { get; set; }

        [DataMember]
        public string ButtonColor { get; set; }

        [DataMember]
        public string ButtonTextColor { get; set; }

        [DataMember]
        public bool ShowAgencyContactDetails { get; set; }

        [DataMember]
        public bool ShowPropManegerContactDetails { get; set; }

        [DataMember]
        public bool OwnerShowPropertyImage { get; set; }

        [DataMember]
        public bool OwnerShowPropertyDescription { get; set; }

        [DataMember]
        public bool OwnerShowTenantDetails { get; set; }

        [DataMember]
        public bool OwnerShowMyDetailsPage { get; set; }

        [DataMember]
        public bool TenantShowMyDetailsPage { get; set; }

        [DataMember]
        public bool TenantShowPropertyImage { get; set; }
                
        [DataMember]
        public bool TenantShowTenancyDetails { get; set; }

        [DataMember]
        public bool UserImportAccessDefault { get; set; }

        [DataMember(Order = 0)]
        public string StrataContactEmail { get; set; }

        [DataMember(Order = 1)]
        public string FileSmartUserName { get; set; }

        [DataMember(Order = 2)]
        public string FileSmartPassword { get; set; }

        [DataMember(Order = 3)]
        public bool StrataShowMeetings { get; set; }

        [DataMember(Order = 4)]
        public bool HasFileSmart { get; set; }

        [DataMember(Order = 5)]
        public string RESTFileSmartUserName { get; set; }

        [DataMember(Order = 6)]
        public string RESTFileSmartPassword { get; set; }

        [DataMember(Order = 7)]
        public bool RESTShowDocumentsPageOwner { get; set; }

        [DataMember(Order = 8)]
        public bool RESTShowDocumentsPageTenant { get; set; }

        [DataMember(Order = 9)]
        public byte[] IPhoneIcon { get; set; }

        [DataMember(Order = 10)]
        public bool HasBanner { get; set; }

        [DataMember(Order = 11)]
        public bool HasFooterBanner { get; set; }

        [DataMember(Order = 12)]
        public bool HasIPhoneIcon { get; set; }

        [DataMember(Order = 13)]
        public bool IsContactEmailMandatory { get; set; }


        #endregion
    }
}
