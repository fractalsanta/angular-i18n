using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Administration.Hierarchy.Api.Models
{
    [Translation("Hierarchy")]
    public class Translations
    {
        #region Menu

        public virtual String Setup
        {
            get { return "Setup"; }
        }

        public virtual String Hierarchy
        {
            get { return "Organizational Hierarchy"; }
        }

        #endregion

        #region Hierarchy View

        public virtual String AddLocation
        {
            get { return "Add Location"; }
        }

        public virtual String Add
        {
            get { return "Add"; }
        }

        public virtual String Edit
        {
            get { return "Edit"; }
        }

        public virtual String View
        {
            get { return "View"; }
        }

        public virtual String NumberNotUnique
        {
            get { return "Location Number already exists."; }
        }

        public virtual String NameNotUnique
        {
            get { return "Location Name already exists."; }
        }

        public virtual String RequestInsufficient
        {
            get { return "Insufficient request."; }
        }

        public virtual String Children
        {
            get { return "Children"; }
        }

        public virtual String UserNameNotUnique
        {
            get { return "Username already exists."; }
        }

        public virtual String ReportsTo
        {
            get { return "Reports to"; }
        }

        public virtual String EmployeeNumberNotUnique
        {
            get { return "Employee number already exists."; }
        }

        public virtual String AddedSingleLocation
        {
            get { return " successfully added to "; }
        }

        public virtual String AddedMultipleLocations
        {
            get { return " Locations successfully added to "; }
        }

        public virtual String Number
        {
            get { return "Number"; }
        }

        public virtual String Name
        {
            get { return "Name"; }
        }

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

        public virtual String LocationWillBeAdded
        {
            get { return "Location will be added to: "; }
        }

        public virtual String Update
        {
            get { return "Update"; }
        }

        public virtual String ChangesMadeTo
        {
            get { return "Changes made to "; }
        }

        public virtual String SuccessfullySaved
        {
            get { return " successfully saved."; }
        }

        public virtual String WillBeEdited
        {
            get { return " will be edited."; }
        }

        public virtual String EditLocation
        {
            get { return "Edit Location"; }
        }

        public virtual String SearchLocations
        {
            get { return "Search Locations..."; }
        }

        public virtual String CannotBeMoved
        {
            get { return "cannot be moved."; }
        }

        public virtual String PossibleParentsFor
        {
            get { return "Possible parents for"; }
        }

        public virtual String SaveSuccessful
        {
            get { return "Save Successful."; }
        }

        public virtual String NoMatchingRecordsFound
        {
            get { return "No matching records found."; }
        }

        public virtual String ID
        {
            get { return "ID"; }
        }

        public virtual String Move
        {
            get { return "Move"; }
        }

        #endregion
    }
}
