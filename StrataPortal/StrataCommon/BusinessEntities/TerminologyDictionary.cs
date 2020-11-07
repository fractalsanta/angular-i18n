using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Serializable]
    public class TerminologyDictionary : Dictionary<string, string>
    {
        public TerminologyDictionary()
            : base()
        {
        }

        public TerminologyDictionary(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context)
            : base(info, context)
        {
        }

        public new string this[string key]
        {
            get
            {
                string value = key;
                base.TryGetValue(value, out value);
                return value;
            }
            set
            {
                base[key] = value;
            }
        }
    }
}
