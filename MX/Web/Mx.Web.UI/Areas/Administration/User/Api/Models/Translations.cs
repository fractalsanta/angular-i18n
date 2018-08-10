using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Administration.User.Api.Models
{
    [Translation("User Setup")]
    public class Translations
    {
        #region Menu

        public virtual String UserSetup
        {
            get { return "User Setup"; }
        }

        #endregion

        #region User View

        public virtual String AddUser
        {
            get { return "Add User"; }
        }

        public virtual String LocationNumber
        {
            get { return "Location Number"; }
        }

        public virtual String LocationName
        {
            get { return "Location Name"; }
        }

        public virtual String FirstName
        {
            get { return "First Name"; }
        }

        public virtual String LastName
        {
            get { return "Last Name"; }
        }

        public virtual String EmployeeNumber
        {
            get { return "Employee Number"; }
        }

        public virtual String Username
        {
            get { return "Username"; }
        }

        public virtual String Edit
        {
            get { return "Edit"; }
        }

        public virtual String On
        {
            get { return "ON"; }
        }

        public virtual String Off
        {
            get { return "OFF"; }
        }

        public virtual String IncludeTerminated
        {
            get { return "Include Terminated Users"; }
        }

        public virtual String IncludeChildLocations
        {
            get { return "Include Child Locations"; }
        }

        public virtual String Terminated
        {
            get { return "Terminated"; }
        }

        public virtual String NoUsers
        {
            get { return "There are no users currently assigned to this location."; }
        }

        public virtual String SelectedLocation
        {
            get { return "Selected Location"; }
        }

        #endregion

        #region Modals

        public virtual String Cancel
        {
            get { return "Cancel"; }
        }

        public virtual String AddAnother
        {
            get { return "Add Another"; }
        }

        public virtual String SaveAndClose
        {
            get { return "Save & Close"; }
        }

        public virtual String Attributes
        {
            get { return "Attributes"; }
        }

        public virtual String SecurityGroups
        {
            get { return "Security Groups"; }
        }

        public virtual String HomeLocation
        {
            get { return "Home Location"; }
        }

        public virtual String Password
        {
            get { return "Password"; }
        }

        public virtual String MiddleName
        {
            get { return "Middle Name"; }
        }

        public virtual String ConfirmPassword
        {
            get { return "Confirm Password"; }
        }

        public virtual String RequestInsufficient
        {
            get { return "Insufficient request."; }
        }

        public virtual String UserNameNotUnique
        {
            get { return "Username already exists."; }
        }

        public virtual String EmployeeNumberNotUnique
        {
            get { return "Employee number already exists."; }
        }

        public virtual String SuccessfullyAdded
        {
            get { return "successfully added."; }
        }

        public virtual String UsersSuccessfullyAdded
        {
            get { return "users successfully added."; }
        }

        public virtual String PswdLengthMustBeSixAndSixteen
        {
            get { return "Passwords must be between 6 and 16 characters."; }
        }

        public virtual String PswdDoNotMatch
        {
            get { return "Passwords do not match."; }
        }

        public virtual String NoSpecialCharacterForEmployeeNumber
        {
            get { return "No special character allowed for Employee Number."; }
        }

        public virtual String EditUser
        {
            get { return "Edit User"; }
        }

        public virtual String Status
        {
            get { return "Status"; }
        }

        public virtual String Active
        {
            get { return "Active"; }
        }

        public virtual String Update
        {
            get { return "Update"; }
        }

        public virtual String TerminateUser
        {
            get { return "Terminate User"; }
        }
        
        public virtual String TerminateUserConfirmMsg
        {
            get { return "This user will be terminated!  Are you sure you want to continue?"; }
        }


        public virtual String TerminateUserTerminate
        {
            get { return "Terminate"; }
        }

        public virtual String SaveSuccessful
        {
            get { return "Save Successful."; }
        }

        public virtual String ChangesMadeTo
        {
            get { return "Changes made to "; }
        }

        public virtual String SuccessfullySaved
        {
            get { return " successfully saved."; }
        }
        #endregion
    }
}