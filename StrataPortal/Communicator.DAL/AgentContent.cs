using System;
using System.Data.Linq.Mapping;
using System.Drawing.Imaging;
using Agile.Diagnostics.Logging;
using Communicator.DAL.Properties;
using Communicator.ImageHelper;
using CommunicatorDto;

namespace Communicator.DAL
{
    /// <summary>
    /// Contains all of the customizations an agent may make to the
    /// branding of the site
    /// </summary>
    public partial class AgentContent
    {
        /// <summary>
        /// override loaded to set createdDate
        /// </summary>
        partial void OnCreated()
        {
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }

        /// <summary>
        /// ToString override
        /// </summary>
        public override string ToString()
        {
            return String.Format("AgentContent [id:{0} AgencyApplicationId {1}]"
                , AgentContentId
                , AgencyApplicationId);
        }

        #region Testing
        /// <summary>
        /// Testing use only
        /// </summary>
        public static class Testing
        {
            public const int AgencyApplicationId = 54345;
            /// <summary>
            /// Get a default client content object for testing, 
            /// all properties will have a value.
            /// </summary>
            /// <returns></returns>
            public static AgentContent GetDevine()
            {
                return new AgentContent
                           {
                               LoginPageTopText = "Rockend message to you!",
                               AgencyAccessId = AgencyApplicationId
                           };
            }
        }

        #endregion

        /// <summary>
        /// Get a default client content object , 
        /// all properties will have a value.
        /// </summary>
        public static AgentContent GetDefault()
        {           
            return new AgentContent
                       {
                           LoginPageTopText = "How is your property performing?",
                           AgencyAccessId = 0,
                           ButtonColor = "#CCCCCC",
                           ButtonTextColor = "#000000"
                       };
        }
        
        #region static dto conversions

        public AgentContentDTO ToDto()
        {
            var result = new AgentContentDTO
            {
                AgencyAccessId = this.AgencyAccessId,
                AgentContentId = this.AgentContentId,
                AgencyApplicationId = this.AgencyApplicationId,
                
                TopImage = this.TopImage != null ? this.TopImage.ToArray() : null,
                MiddleImage = this.MiddleImage != null ? this.MiddleImage.ToArray() : null,
                BottomRightImage = this.BottomRightImage != null ? this.BottomRightImage.ToArray() : null,
                ButtonColor = this.ButtonColor,
                ButtonTextColor = this.ButtonTextColor,
                CreatedDate = this.CreatedDate,
                IncExpReportsOn = this.IncExpReportsOn,
                LoginPageTopText = this.LoginPageTopText,
                OwnerReportsOn = this.OwnerReportsOn,
                UpdatedDate = this.UpdatedDate,
                AgencyUrl = this.AgencyUrl,
                FooterBannerUrl = this.FooterBannerUrl,
                ShowAgencyContactDetails = this.ShowAgencyContactDetails,
                ShowPropManegerContactDetails = this.ShowPropManegerContactDetails,
                OwnerShowPropertyImage = this.OwnerShowPropertyImage,
                OwnerShowPropertyDescription = this.OwnerShowPropertyDescription,
                OwnerShowTenantDetails = this.OwnerShowTenantDetails,
                OwnerShowMyDetailsPage = this.OwnerShowMyDetailsPage,
                TenantShowTenancyDetails = this.TenantShowTenancyDetails,
                TenantShowPropertyImage = this.TenantShowPropertyImage,
                TenantShowMyDetailsPage = this.TenantShowMyDetailsPage,
                UserImportAccessDefault = this.UserImportAccessDefault,
                StrataContactEmail = this.StrataContactEmail,
                HasFileSmart = this.HasFileSmart,
                FileSmartUserName = this.FileSmartUserName,
                FileSmartPassword = this.FileSmartPassword,
                StrataShowMeetings = this.StrataShowMeetings,
                RESTFileSmartUserName = this.RESTFileSmartUserName,
                RESTFileSmartPassword = this.RESTFileSmartPassword,
                RESTShowDocumentsPageOwner = this.RESTShowDocumentsPageOwner,
                RESTShowDocumentsPageTenant = this.RESTShowDocumentsPageTenant,
                IPhoneIcon = this.IPhoneIcon != null ? this.IPhoneIcon.ToArray() : null,
                HasBanner = this.HasBanner,
                HasFooterBanner = this.HasFooterBanner,
                HasIPhoneIcon = this.HasIPhoneIcon
                , IsContactEmailMandatory = IsContactEmailMandatory
            };

            return result;
        }

        /// <summary>
        /// Call for newly added Agent Content only
        /// </summary>
        /// <param name="dto">Agent Content DTO</param>
        /// <returns>Agent Content</returns>
        public static AgentContent ToEntity(AgentContentDTO dto)
        {
            var result = new AgentContent
            {
                AgencyAccessId = dto.AgencyAccessId,
                AgentContentId = dto.AgentContentId,
                AgencyApplicationId = dto.AgencyApplicationId,
                BottomRightImage = dto.BottomRightImage,
                TopImage = dto.TopImage,
                MiddleImage = dto.MiddleImage,
                ButtonColor = dto.ButtonColor,
                ButtonTextColor = dto.ButtonTextColor,
                CreatedDate = dto.CreatedDate,
                IncExpReportsOn = dto.IncExpReportsOn,
                LoginPageTopText = dto.LoginPageTopText,
                OwnerReportsOn = dto.OwnerReportsOn,
                UpdatedDate = dto.UpdatedDate,
                AgencyUrl = dto.AgencyUrl,
                FooterBannerUrl = dto.FooterBannerUrl,
                ShowAgencyContactDetails = dto.ShowAgencyContactDetails,
                ShowPropManegerContactDetails = dto.ShowPropManegerContactDetails,
                OwnerShowPropertyImage = dto.OwnerShowPropertyImage,
                OwnerShowPropertyDescription = dto.OwnerShowPropertyDescription,
                OwnerShowTenantDetails = dto.OwnerShowTenantDetails,
                OwnerShowMyDetailsPage = dto.OwnerShowMyDetailsPage,
                TenantShowTenancyDetails = dto.TenantShowTenancyDetails,
                TenantShowPropertyImage = dto.TenantShowPropertyImage,
                TenantShowMyDetailsPage = dto.TenantShowMyDetailsPage,
                UserImportAccessDefault = dto.UserImportAccessDefault,
                HasFileSmart = dto.HasFileSmart,
                StrataShowMeetings = dto.StrataShowMeetings,
                RESTShowDocumentsPageOwner = dto.RESTShowDocumentsPageOwner,
                RESTShowDocumentsPageTenant = dto.RESTShowDocumentsPageTenant,
                IPhoneIcon = dto.IPhoneIcon,
                HasBanner = dto.HasBanner,
                HasFooterBanner = dto.HasFooterBanner,
                HasIPhoneIcon = dto.HasIPhoneIcon,
            };

            // Bind only if new value is passed to avoid overriding previously saved value upon various other calls
            result.StrataContactEmail = !String.IsNullOrEmpty(dto.StrataContactEmail) ? dto.StrataContactEmail : string.Empty;

            result.FileSmartUserName = !String.IsNullOrEmpty(dto.FileSmartUserName) ? dto.FileSmartUserName : string.Empty;

            result.FileSmartPassword = !String.IsNullOrEmpty(dto.FileSmartPassword) ? dto.FileSmartPassword : string.Empty;

            result.RESTFileSmartUserName = !String.IsNullOrEmpty(dto.RESTFileSmartUserName) ? dto.RESTFileSmartUserName : string.Empty;

            result.RESTFileSmartPassword = !String.IsNullOrEmpty(dto.RESTFileSmartPassword) ? dto.RESTFileSmartPassword : string.Empty;

            return result;
        }

        #endregion
    }

    public static class AgentContentExtensions
    {
        public static void UpdateEntity(this AgentContentDTO dto, AgentContent entity, bool ignoreHasBanners = false)
        {
            entity.UpdatedDate = DateTime.Now;
            entity.BottomRightImage = dto.BottomRightImage;
            entity.TopImage = dto.TopImage;
            entity.MiddleImage = dto.MiddleImage;            
            entity.IncExpReportsOn = dto.IncExpReportsOn;
            entity.OwnerReportsOn = dto.OwnerReportsOn;    
            entity.ShowAgencyContactDetails = dto.ShowAgencyContactDetails;
            entity.ShowPropManegerContactDetails = dto.ShowPropManegerContactDetails;
            entity.OwnerShowPropertyDescription = dto.OwnerShowPropertyDescription;
            entity.OwnerShowPropertyImage = dto.OwnerShowPropertyImage;
            entity.OwnerShowTenantDetails = dto.OwnerShowTenantDetails;
            entity.OwnerShowMyDetailsPage = dto.OwnerShowMyDetailsPage;
            entity.TenantShowPropertyImage = dto.TenantShowPropertyImage;
            entity.TenantShowMyDetailsPage = dto.TenantShowMyDetailsPage;
            entity.TenantShowTenancyDetails = dto.TenantShowTenancyDetails;
            entity.UserImportAccessDefault = dto.UserImportAccessDefault;
            entity.HasFileSmart = dto.HasFileSmart;
            entity.StrataShowMeetings = dto.StrataShowMeetings;
            entity.RESTShowDocumentsPageOwner = dto.RESTShowDocumentsPageOwner;
            entity.RESTShowDocumentsPageTenant = dto.RESTShowDocumentsPageTenant;
            entity.IPhoneIcon = dto.IPhoneIcon;

            entity.HasBanner = dto.HasBanner;
            entity.HasFooterBanner = dto.HasFooterBanner;
            entity.HasIPhoneIcon = dto.HasIPhoneIcon;
             
            Logger.Info("({0}) hasBanner={1} hasFooter={2} hasIPhoneIcon={3}", entity.AgencyApplicationId, entity.HasBanner, entity.HasFooterBanner, entity.HasIPhoneIcon);

            entity.IsContactEmailMandatory = dto.IsContactEmailMandatory;

            // Only update string vals that are different from original entity
            if (entity.ButtonColor != dto.ButtonColor)
                entity.ButtonColor = dto.ButtonColor;
            if (entity.ButtonTextColor != dto.ButtonTextColor)
                entity.ButtonTextColor = dto.ButtonTextColor;
            if (entity.LoginPageTopText != dto.LoginPageTopText)
                entity.LoginPageTopText = dto.LoginPageTopText;
            if (entity.AgencyUrl != dto.AgencyUrl)
                entity.AgencyUrl = dto.AgencyUrl;
            if (entity.FooterBannerUrl != dto.FooterBannerUrl)
                entity.FooterBannerUrl = dto.FooterBannerUrl;

            // Bind only if new value is passed to avoid overriding previously saved value upon various other calls
            if (!String.IsNullOrEmpty(dto.StrataContactEmail))
                entity.StrataContactEmail = dto.StrataContactEmail;
            if (!String.IsNullOrEmpty(dto.FileSmartUserName))
                entity.FileSmartUserName = dto.FileSmartUserName;
            if (!String.IsNullOrEmpty(dto.FileSmartPassword))
                entity.FileSmartPassword = dto.FileSmartPassword;
            if (!String.IsNullOrEmpty(dto.RESTFileSmartUserName))
                entity.RESTFileSmartUserName = dto.RESTFileSmartUserName;
            if (!String.IsNullOrEmpty(dto.RESTFileSmartPassword))
                entity.RESTFileSmartPassword = dto.RESTFileSmartPassword;  
        }
    }
}
