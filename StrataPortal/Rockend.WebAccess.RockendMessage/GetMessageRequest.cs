using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.RockendMessage
{
    [DataContract]
    public class GetMessageRequest
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            var builder = new StringBuilder(string.Format("AMH:{0} ", MachineName));
            if (AppKeyMachineList != null && AppKeyMachineList.Any())
            {
                // can't use .ForEach because used on multiple platforms. (problem on Win8!)
                foreach (var machine in AppKeyMachineList)
                    builder.AppendLine(string.Format("key:{0}  M:{1}", machine.AppKey, machine.MachineName));
            }
            return builder.ToString();
        }

        /// <summary>
        /// Amh WCF clients will timeout after this period elapses.
        /// Server should return at least a few seconds before.
        /// </summary>
        public static int ListenerTimeoutSeconds = 52;

        /// <summary>
        /// AMH is running on this machine
        /// </summary>
        [DataMember]
        public string MachineName { get; set; }

        [DataMember]
        public int AmhVersion { get; set; }

        [DataMember]
        public Guid AgencyGuid { get; set; }

        [DataMember]
        public List<int> ApplicationKeyList { get; set; }

        [DataMember]
        public List<AppKeyMachine> AppKeyMachineList { get; set; }

        public bool HasAtLeastOneAppKey()
        {
            return AppKeyMachineList != null && AppKeyMachineList.Any();
        }

    }

    [DataContract]
    public class AppKeyMachine
    {
        public override string ToString()
        {
            return string.Format("{0} {1}", AppKey, MachineName);
        }
        
        [DataMember]
        public int AppKey { get; set; }

        [DataMember]
        public int AppVersion { get; set; }

        [DataMember]
        public int AppmhVersion { get; set; }

        [DataMember]
        public string MachineName { get; set; }  

        public override bool Equals(object obj)
        {
            //       
            // See the full list of guidelines at
            //   http://go.microsoft.com/fwlink/?LinkID=85237  
            // and also the guidance for operator== at
            //   http://go.microsoft.com/fwlink/?LinkId=85238
            //

            var compare = obj as AppKeyMachine;
            if (obj == null || compare == null)
                return false;

            return AppKey == compare.AppKey && MachineName == compare.MachineName;
        }

        public override int GetHashCode()
        {
            return AppKey.GetHashCode();
        }
    }

    public static class Extensions
    {
        public static bool HasMultipleMachinesForOneAppKey(this List<AppKeyMachine> list)
        {
            try
            {
                return list != null 
                    && list.GroupBy(machine => machine.AppKey).Count() > 1;
            }
            catch
            {
                return false;
            }
        }

        public static string GetApplicationKeysString(this GetMessageRequest request)
        {
            if (request == null || request.ApplicationKeyList == null)
                return "--null--";
            if (request.ApplicationKeyList.Count == 0)
                return "--none--";
            var all = new StringBuilder();

            foreach (int key in request.ApplicationKeyList)
            {
                all.Append(string.Format("| {0}", key));
            }

            return all.ToString().Remove(0, 2);
        }
    }
}
