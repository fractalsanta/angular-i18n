using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Rockend.iStrata.StrataCommon;
using System.ComponentModel.DataAnnotations;
using Rockend.iStrata.StrataWebsite.Data;
using Rockend.iStrata.StrataWebsite.Helpers;
using Communicator.DAL;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class LogonModel : ModelBase
    {
        [Required]
        [Display(Name = "Strata Agency ID")]
        public string AgencyId { get; set; }

        [Required]
        [Display(Name = "Access Code")]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required]
        [Display(Name = "Owner or Committee Member")]
        public string UserTypeId { get; set; }

        public List<SelectListItem> Roles
        {
            get
            {
                return new List<SelectListItem>
                {
                    new SelectListItem
                    { 
                        Text = RoleInfo.RoleNameOwner.ToString(), 
                        Value = ((int)Role.Owner).ToString()
                    },
                    new SelectListItem
                    {
                        Text = RoleInfo.RoleNameExecMember.ToString(),
                        Value = ((int)Role.ExecutiveMember).ToString()
                    }
                };
            }
        }

        public bool DocumentsAreEnabled()
        {
            ServiceAgencyApplication docsService = base.CommunicatorData.LoadAgentServicesByServiceKey(int.Parse(AppKeyHelper.GetApplicationKeyFromUrl()), (int)Rockend.Common.RockendHelper.RwacService.StratePortal);

            return (AgentContentStrata != null && AgentContentStrata.AgentContent.HasFileSmart && docsService != null && docsService.IsActive);
        }
    }
}