using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq.Mapping;
using System.Data.SqlClient;
using System.Data;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    /// <summary>
    /// The database table to which this class relates has no primary key so LINQ is not used 
    /// </summary>
    public class WebAccessStatus
    {
        #region Constants
        public const string TableName = "WebAccessStatus";
        public const string col_WebAccessStatusID = "lWebAccessStatusID";
        public const string col_StataExeProcess = "lStrataExeProcess";
        public const string col_LastWebAccessRequestID = "lLastWebAccessRequestID";
        public const string col_StrataKeepAliveStamp = "dStrataKeepAliveStamp";
        public const string col_StrataExitCode = "lStrataExitCode";
        #endregion

        #region Properties
        public int WebAccessStatusID { get; set; }
        public int StrataExeProcess { get; set; }
        public int LastWebAccessRequestID { get; set; }
        public DateTime StrataKeepAliveStamp { get; set; }
        public int StrataExitCode { get; set; }
        #endregion

        #region Constructors
        #endregion

    }
}
