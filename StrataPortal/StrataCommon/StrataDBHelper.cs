using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq;
using System.Configuration;
using System.IO;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;
using Agile.Diagnostics.Logging;
using Rockend.WebAccess.Common;

namespace Rockend.iStrata.StrataCommon
{
    /// <summary>
    /// This class relies on Strata Master being installed on the machine on which it is running
    /// </summary>
    public static class StrataDBHelper
    {
        #region Private methods
        private static string ReadConnectionString()
        {
            string strataDir = ConfigurationManager.AppSettings["StrataDirectory"];

            return ReadConnectionString(strataDir);
        }

        const string DefaultConnection = "Persist Security Info=True;User ID=sa;Password=Rockend;Initial Catalog=Strata;Data Source=(local);Network Library=DBMSSOCN";

        /// <summary>
        /// Read the connection string from the Strata Master installation file strata.udl
        /// Path for the strata installation should be entered into the StrataDirectory appSetting inside
        /// the configuration file.
        /// </summary>
        /// <returns>The connection string from the Strata.udl file</returns>
        private static string ReadConnectionString(string strataDir)
        {
            string line;
            var udlConnection = string.Empty;
            const string providerString = "provider=";

            var udlPath = (strataDir ?? "nullDir") + @"\Strata.udl";
            // Read the connection string from the udl file
            if (!File.Exists(udlPath))
            {
                Logger.Warning("could not find udl path: {0}", udlPath);
                return DefaultConnection;
            }

            using (StreamReader reader = new StreamReader(udlPath))
            {
                while ((line = reader.ReadLine()) != null)
                {
                    if (line.ToLower().IndexOf(providerString) >= 0)
                    {
                        udlConnection = line.Substring(line.ToLower().IndexOf(providerString) + providerString.Length);
                    }
                }
            }

            // If we didn't get it then set a default connection string 
            // (taken from WebAccess.StrataBusiness.StrataBizLogic.GetStrataConnectionString)
            if (udlConnection.Length == 0)
            {
                udlConnection = DefaultConnection;
            }
            else
            {
                var connection = new StringBuilder();
                string value = udlConnection.KeyValueExtraction("initial catalog");
                if (value.Length == 0)
                    value = udlConnection.KeyValueExtraction("database");
                connection.Append(String.Format("initial catalog={0};", value == String.Empty ? "strata" : value));

                value = udlConnection.KeyValueExtraction("data source");
                if (value.Length == 0)
                    value = udlConnection.KeyValueExtraction("server");
                connection.Append(String.Format("data source={0};", value == String.Empty ? "." : value));

                value = udlConnection.KeyValueExtraction("user id");
                if (value.Length > 0)
                {
                    connection.Append(String.Format("user id={0};", value == String.Empty ? "sa" : value));

                    value = udlConnection.KeyValueExtraction("password");
                    connection.Append(String.Format("password={0};", value == String.Empty ? "" : value));

                    connection.Append("trusted_connection=no;");
                }
                else
                {
                    connection.Append("trusted_connection=yes;");
                }

                value = udlConnection.KeyValueExtraction("persist security info");
                connection.Append(String.Format("persist security info={0};", value == String.Empty ? "true" : value));

                udlConnection = connection.ToString();
            }

            return udlConnection;
        }

        private static SqlConnection MakeStandardSqlConnection()
        {
            string strataDB = ReadConnectionString();
            if (strataDB.Length > 0)
            {
                return new SqlConnection(strataDB);
            }
            else
            {
                throw new InvalidOperationException("Unable to find strata database connection details, check Strata.udl");
            }
        }

        private static void ExecuteNonQuery(string sql, List<SqlParameter> dbParameters)
        {
            using (SqlConnection con = MakeStandardSqlConnection())
            {
                SqlCommand com = new SqlCommand(sql, con);

                foreach (DbParameter parameter in dbParameters)
                {
                    com.Parameters.Add(parameter);
                }

                con.Open();
                com.ExecuteNonQuery();
            }
        }
        #endregion

        #region Public methods
        /// <summary>
        /// Get a LINQ DataContext for the Strata Master database
        /// throws:
        ///     InvalidOperationException if unable to read Strata Master connection settings
        /// </summary>
        /// <returns>The DataContext</returns>
        public static DataContext GetStrataDataContext(string exeDir)
        {
            string strataDB = ReadConnectionString(exeDir);

            if (strataDB.Length > 0)
            {
                return new DataContext(strataDB);
            }
            else
            {
                throw new InvalidOperationException("Unable to find strata database connection details, check Strata.udl");
            }
        }

        public static DataContext GetStrataDataContext()
        {
            string exeDir = ConfigurationManager.AppSettings["StrataDirectory"];

            return GetStrataDataContext(exeDir);
        }

        /// <summary>
        /// Opens a standard <see cref="SqlConnection"/> to the Strata Master database,
        /// executes an sql statement and returns the results as a new DataTable
        /// </summary>
        /// <param name="sql">The sql command to execute</param>
        /// <returns>A new <see cref="DataTable"/> with the results</returns>
        public static DataTable GetDataTable(string sql)
        {
            DataTable dt = new DataTable(); 

            using (SqlConnection con = MakeStandardSqlConnection())
            {
                SqlCommand com = new SqlCommand(sql, con);
                con.Open();
                dt.Load(com.ExecuteReader());
            }

            return dt;
        }

        public static void InsertRow(string tableName, Dictionary<string, object> updateCols)
        {
            StringBuilder sql = new StringBuilder();
            StringBuilder cols = new StringBuilder();
            StringBuilder vals = new StringBuilder();
            List<SqlParameter> insertParams = new List<SqlParameter>();

            sql.Append("Insert [" + tableName + "] ");
            int colCnt = 1;
            foreach (string colName in updateCols.Keys)
            {
                if (colCnt++ < updateCols.Count)
                {
                    cols.Append(colName + ",");
                    vals.Append("@p" + insertParams.Count.ToString() + ",");
                }
                else
                {
                    cols.Append(colName);
                    vals.Append("@p" + insertParams.Count.ToString());
                }

                insertParams.Add(new SqlParameter("@p" + insertParams.Count.ToString(), updateCols[colName]));
            }
            sql.Append("(" + cols.ToString() + ") Values (" + vals.ToString() + ")");

            ExecuteNonQuery(sql.ToString(), insertParams);
        }

        public static void UpdateRow(string tableName, Dictionary<string, object> updateCols, Dictionary<string, object> keyCols)
        {
            StringBuilder sql = new StringBuilder();
            List<SqlParameter> updateParams = new List<SqlParameter>();

            sql.Append("Update [" + tableName + "] Set ");
            int colCnt = 1;
            foreach (string colName in updateCols.Keys)
            {
                if (colCnt++ < updateCols.Count)
                    sql.Append(colName + " = @p" + updateParams.Count.ToString() + ",");
                else
                    sql.Append(colName + " = @p" + updateParams.Count.ToString());

                updateParams.Add(new SqlParameter("@p" + updateParams.Count.ToString(), updateCols[colName]));

            }

            if (keyCols.Count > 0)
            {
                sql.Append(" Where ");
                int keyCnt = 1;
                foreach (string keyName in keyCols.Keys)
                {
                    if (keyCnt++ < keyCols.Count)
                    {
                        sql.Append(keyName + " = @p" + updateParams.Count.ToString() + " And ");
                    }
                    else
                    {
                        sql.Append(keyName + " = @p" + updateParams.Count.ToString());
                    }

                    updateParams.Add(new SqlParameter("@p" + updateParams.Count.ToString(), keyCols[keyName]));
                }
            }

            ExecuteNonQuery(sql.ToString(), updateParams);
        }

        public static void Delete(string tableName, Dictionary<string, object> keyCols)
        {
            StringBuilder sql = new StringBuilder();
            List<SqlParameter> deleteParams = new List<SqlParameter>();

            sql.Append("Delete [" + tableName + "] Where ");
            int keyCnt = 1;
            foreach (string keyName in keyCols.Keys)
            {
                if (keyCnt++ < keyCols.Count)
                {
                    sql.Append(keyName + " = @p" + deleteParams.Count.ToString() + " And ");
                }
                else
                {
                    sql.Append(keyName + " = @p" + deleteParams.Count.ToString());
                }

                deleteParams.Add(new SqlParameter("@p" + deleteParams.Count.ToString(), keyCols[keyName]));
            }

            ExecuteNonQuery(sql.ToString(), deleteParams);
        }
        #endregion 

        public static T GetFirstRecord<T>(string exePath) where T : class
        {
            using (var context = GetStrataDataContext(exePath))
            {
                return (from a in context.GetTable<T>()
                        select a).FirstOrDefault();
            }
        }

        /// <summary>
        /// Get the first record in the table for the given Strata Type
        /// </summary>
        public static T GetFirstRecord<T>() where T : class
        {
            using (var context = GetStrataDataContext())
            {
                return (from a in context.GetTable<T>()
                              select a).FirstOrDefault();
            }
        }

    }
}
