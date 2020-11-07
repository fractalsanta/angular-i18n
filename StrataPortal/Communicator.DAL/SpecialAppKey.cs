using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Communicator.DAL
{
    public partial class SpecialAppKey
    {
        public override string ToString()
        {
            return string.Format("[{0}] key: {1} type: {2}"
                , Id, AppKey, TypeId);
        }

        public static class Types
        {
            public const int LogResponseXml = 1;
            public const int BenchmarkBeta = 2;
            public const int RwacBetaClient = 3;
            /// <summary>
            /// Do not deploy new versions of RWAC to these appkeys
            /// </summary>
            public const int RwacBlackList = 4;
            public const int ProcessorBetaList = 5;
        }

    }

    public static class SpecailAppKeyExtensions
    {
        public static List<int> AsAppKeyList(this IList<SpecialAppKey> specials)
        {
            return (from x in specials
                select x.AppKey).ToList();
        }
    }
}
