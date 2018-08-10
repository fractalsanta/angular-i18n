using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Administration.ChangeStore.Api.Models
{
    [Translation("ChangeStore")]
    public class L10N
    {
        public virtual string ChangeStore
        {
            get { return "Change Store"; }
        }

        public virtual string Store
        {
            get { return "Store"; }
        }

        public virtual string Select
        {
            get { return "Select"; }
        }

        public virtual string TypeToSearch
        {
            get { return "Type to search..."; }
        }

        public virtual string UnexpectedError
        {
            get { return "An unexpected error has occurred"; }
        }

        public virtual string StoreSelected
        {
            get { return "Store has been selected: "; }
        }

    }
}