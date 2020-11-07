using System;
using System.Collections.Generic;
using System.Linq;
using Agile.Diagnostics.AzureDb;
using Agile.Diagnostics.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Rockend.WebAccess.RockendMessage;

namespace Communicator.DAL.Tests
{
    [TestClass]
    public class GeneralTests
    {


        #region LinqGroupByTest

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        [Ignore]
        public void LinqGroupByTest()
        {
            Logger.Testing("ARRANGE");
            var list = new List<AppKeyMachine>();

            Logger.Testing("ASSERT False");
            Assert.IsFalse(list.HasMultipleMachinesForOneAppKey());

            Logger.Testing("add one app key machine");
            list.Add(new AppKeyMachine { AppKey = 123456, MachineName = "MACH1" });
            Logger.Testing("ASSERT False");
            Assert.IsFalse(list.HasMultipleMachinesForOneAppKey());

            Logger.Testing("add another app key machine for a different appkey");
            list.Add(new AppKeyMachine { AppKey = 666666, MachineName = "MACH1" });
            Logger.Testing("ASSERT False");
            Assert.IsFalse(list.HasMultipleMachinesForOneAppKey());

            Logger.Testing("add another app key machine for the original appkey - different machine");
            list.Add(new AppKeyMachine { AppKey = 123456, MachineName = "MACH2" });
            Logger.Testing("ASSERT  TRUE!");
            Assert.IsTrue(list.HasMultipleMachinesForOneAppKey());
        }

        #endregion

        #region DirectUpdateTest

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void DirectUpdateTest()
        {

            Logger.Testing("ARRANGE create the cntext and load an agencyApp");
            using (RestCentral context = RestCentral.BuildForTesting())
            {
                const string amhMachine = "MarkTestAmh";
                const string appMachine = "MarkAppMachine";
                context.ExecuteCommand(string.Format(@"UPDATE rmh.AgencyApplication 
SET 
    Listened = getdate()
    , AmhMachine = '{0}'
    , AppMachine = '{1}'
WHERE
    ApplicationKey = {2}
", amhMachine, appMachine, 105275));


                var agencyApplication = (from aa in context.GetTable<AgencyApplication>()
                                         where aa.ApplicationKey == 105275
                                         select aa).FirstOrDefault();

                Assert.IsNotNull(agencyApplication);

                Assert.AreEqual(amhMachine, agencyApplication.AmhMachine);
                Assert.AreEqual(appMachine, agencyApplication.AppMachine);
            }
        }

        #endregion

        #region TestLinqToSqlUpdate

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void TestLinqToSqlUpdate()
        {
            Logger.Testing("ARRANGE create the cntext and load an agencyApp");
            using (RestCentral context = RestCentral.BuildForTesting())
            {
                Logger.Testing("ACT update listened field only");


                var writer = new MyWriter();

                context.Log = writer;

                var appKey = 105275;

                try
                {
                    var agencyApplication = (from aa in context.GetTable<AgencyApplication>()
                                                where aa.ApplicationKey == appKey
                                                select aa).FirstOrDefault();

                    Assert.IsNotNull(agencyApplication);

                    agencyApplication.Listened = DateTime.Now;
//                    agencyApplication.AmhMachine = listener.MachineName;
//                    if (agencyApplication.AppMachine != akm.MachineName) // log if it has changed (to help us track down where we have multiple machine activations per appKey)
//                        Logger.Warning("key;{0} appMachine changed from: {1} to {2} (not a problem unless the machine name changes regularly (like every minute!)", akm.AppKey, agencyApplication.AppMachine, akm.MachineName);
//                    agencyApplication.AppMachine = akm.MachineName;
                    context.SubmitChanges();
                    
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "TestLinqToSqlUpdate");
                }
                
            }


        }

        #endregion


        #region NewAzureSqlLogTest

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void NewAzureSqlLogTest()
        {
            Logger.AddLogger(new AzureDatabaseLogger("UnitTest", Environment.MachineName));
            Logger.Testing("testing one");
            Logger.Testing("testing two");
            Logger.Error(new Exception("testing error"), "testing three");



        }

        #endregion
    }

}
