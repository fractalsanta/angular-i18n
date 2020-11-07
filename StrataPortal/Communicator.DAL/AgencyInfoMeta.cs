namespace Communicator.DAL
{
    public partial class AgencyInfoMeta
    {
        public override string ToString()
        {
            return string.Format("[{0}] {1}", AgencyInfoMetaId, Name);
        }

        public static class Types
        {
            public static string WebApi = "WAPI";
            public static string Util = "UTIL";
            public static string Test = "TEST";
            public static string Unknown = "UNK";
        }
        
    }
}