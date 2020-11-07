using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.Transport
{
    [DataContract]
    public class RockendRequest 
    {
        [DataMember]
        public Dictionary<string, string> Parameters { get; set; }

        public string GetParameterValue(string parameterName)
        {
            if (Parameters.ContainsKey(parameterName))
            {
                return Parameters[parameterName];
            }
            else
            {
                throw new NullReferenceException(string.Format("Parameter {0} does not exists in request", parameterName));
            }
        }
    }
}
