using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Rockend.iStrata.StrataCommon;

namespace Rockend.iStrata.StrataWebsite.Model
{
    [Serializable]
    public class RetrievePasswordModel
    {
        public RetrievePasswordModel()
        {
        }

        public void Reset()
        {
            UserName = string.Empty;
            Password = string.Empty;
        }

        [Required]
        [Display(Name = "Username")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Email")]
        public string Email { get; set; }

        // two ids have been defind here as there are two dropdowns on the page... one for searching for username 
        // and one for searching for password. Makes easier on client side (using script to detect selected value).
        public string PasswordUserTypeId { get; set; }

        public string UsernameUserTypeId { get; set; }

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
    }
}