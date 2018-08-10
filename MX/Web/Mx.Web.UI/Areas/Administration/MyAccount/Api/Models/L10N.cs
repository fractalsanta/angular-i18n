using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Administration.MyAccount.Api.Models
{
    [Translation("MyAccount")]
    public class L10N
    {
        public virtual string Off
        {
            get { return "OFF"; }
        }
        public virtual string On
        {
            get { return "ON"; }
        }
        public virtual string MyAccount
        {
            get { return "My Account"; }
        }
        public virtual string ManagePIN
        {
            get { return "Manage PIN"; }
        }
        public virtual string SetPIN
        {
            get { return "Set PIN"; }
        }
        public virtual string UpdatePIN
        {
            get { return "Update PIN"; }
        }
        public virtual string YourCurrentPassword
        {
            get { return "Your current password"; }
        }
        public virtual string YourNewPIN
        {
            get { return "Your new PIN"; }
        }
        public virtual string ConfirmYourPIN
        {
            get { return "Confirm your PIN"; }
        }
        public virtual string Save
        {
            get { return "Save"; }
        }
        public virtual string Reset
        {
            get { return "Reset"; }
        }
        public virtual string Enable
        {
            get { return "Enable"; }
        }
        public virtual string Cancel
        {
            get { return "Cancel"; }
        }
        public virtual string PINsDoNotMatch
        {
            get { return "PINs do not match."; }
        }
        public virtual string InvalidCredentials 
        { 
            get { return "Your password is incorrect."; } 
        }
        public virtual string TurnOFFMessageTitle
        {
            get { return "Disable PIN"; }
        }
        public virtual string TurnOFFMessage
        {
            get { return "Are you sure you want to disable your PIN login?"; }
        }
        public virtual string TurnOFFConfirm
        {
            get { return "Confirm"; }
        }
    }
}
