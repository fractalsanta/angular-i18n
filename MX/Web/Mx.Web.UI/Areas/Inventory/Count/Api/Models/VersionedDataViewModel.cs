using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class VersionedDataViewModel
    {
        public Int32 DataVersion { get; private set; }

        public Object Data { get; set; }

        public VersionedDataViewModel(Object data, Int32? versionOffset)
        {
            //TODO: Figure out what this doggy model does :-)

            //var jsSerializer = new JavaScriptSerializer();
            ////Convert to json string first
            //var output = jsSerializer.Serialize(data);
            //DataVersion = output.GetHashCode();

            //if (versionOffset.HasValue)
            //{
            //    DataVersion += versionOffset.Value;
            //}

            //Data = data;
        }
    }
}