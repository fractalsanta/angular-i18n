using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Agile.Diagnostics.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Rockend.Common;
using Rockend.Common.Helpers;
using RwacUtility.Objects;

namespace Communicator.DAL.Tests
{
    [TestClass]
    public class CentralRepositoryTests
    {
        const string SerialNumber = "SerialNo123";
        const string ClientCode = "CLIENT21";
        const string AgencyName = "LoadAgencyInfoMetaReturnsExistingRecord";

        [ClassInitialize]
        public static void TestFixtureSetup(TestContext context)
        {
            var environmentService = new SpecifiedEnvironmentService();
            environmentService.SetEnvironment("Uat");
            SimpleContainer.RegisterSingle<IEnvironmentService>(environmentService);
        }


        #region UpdateAgencyInfosUpdatesExistingRecords

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void UpdateAgencyInfosUpdatesExistingRecords()
        {
            Logger.Testing("ARRANGE create the repo (auto connects to UAt)");
            var repo = new CentralRepository();

            Logger.Testing("ARRANGE first need to create the meta record");
            var meta = repo.CreateAgencyInfoMeta(SerialNumber, ClientCode, AgencyName, AgencyInfoMeta.Types.Test);
            Logger.Testing("ASSERT double check zero existing Infos for the serialNumber");
            var loadedInfos = repo.LoadAgencyInfos(meta.SerialNumber);

            try
            {
                Assert.AreEqual(0, loadedInfos.Count);
//                var existing = repo.LoadAgencyInfos(needsToBeSerialNumber);
                Logger.Testing("ARR create the new pre-existing items ");
                var infoOne = new AgencyInfo { Name = "One", Value = "OneValue" };
                var infoTwo = new AgencyInfo { Name = "Two", Value = "TwoValue" };
                var infoThree = new AgencyInfo { Name = "Three", Value = "ThreeValue" };

                var infos = new List<AgencyInfo> { infoOne, infoTwo, infoThree };
                repo.UpdateAgencyInfos(meta, infos);

                Logger.Testing("ASSERT all three items loaded");
                loadedInfos = repo.LoadAgencyInfos(meta.SerialNumber);
                Assert.AreEqual(3, loadedInfos.Count);

                Logger.Testing("create the updates");
                var infoOne2 = new AgencyInfo { Name = "One", Value = "updateOne" };
                var infoTwo2 = new AgencyInfo { Name = "Two", Value = "updateTwo" };
                var infoThree2 = new AgencyInfo { Name = "Three", Value = "updateThree" };

                var infoUpdates = new List<AgencyInfo> { infoOne2, infoTwo2, infoThree2 };

                Assert.IsTrue(loadedInfos.Any(info => info.Name == "One"));
                Assert.IsTrue(loadedInfos.Any(info => info.Name == "Two"));
                Assert.IsTrue(loadedInfos.Any(info => info.Name == "Three"));
                repo.UpdateAgencyInfos(meta, infoUpdates);

                Logger.Testing("reload and check still only 3 and their values were updated");
                loadedInfos = repo.LoadAgencyInfos(meta.SerialNumber);
                Assert.AreEqual(3, loadedInfos.Count);
                Assert.IsTrue(loadedInfos.Any(info => info.Value == "updateOne"));
                Assert.IsTrue(loadedInfos.Any(info => info.Value == "updateTwo"));
                Assert.IsTrue(loadedInfos.Any(info => info.Value == "updateThree"));

            }
            finally
            {
                Logger.Testing("finally, must delete the records that were created");
                loadedInfos.ToList().ForEach(info => repo.Delete(info.Clone())); // have to clone to get around context issues
                repo.Delete(meta);
            }
        }

        #endregion

        #region UpdateAgencyInfosAddsNewRecordsWhenNotExists

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void UpdateAgencyInfosAddsNewRecordsWhenNotExists()
        {
            Logger.Testing("ARRANGE create the repo (auto connects to UAt)");
            var repo = new CentralRepository();

            Logger.Testing("ARRANGE first need to create the meta record");
            var meta = repo.CreateAgencyInfoMeta(SerialNumber, ClientCode, AgencyName, AgencyInfoMeta.Types.Test);
            Logger.Testing("ASSERT double check zero existing Infos for the serialNumber");
            var loadedInfos = repo.LoadAgencyInfos(meta.SerialNumber);

            try
            {
                Assert.AreEqual(0, loadedInfos.Count);

//                var existing = repo.LoadAgencyInfos(needsToBeSerialNumber);
                Logger.Testing("ARR create the new info items that should be added");
                var infoOne = new AgencyInfo { Name = "One", Value = "OneValue" };
                var infoTwo = new AgencyInfo { Name = "Two", Value = "TwoValue" };
                var infoThree = new AgencyInfo { Name = "Three", Value = "ThreeValue" };

                var infos = new List<AgencyInfo> { infoOne, infoTwo, infoThree };
                repo.UpdateAgencyInfos(meta, infos);

                Logger.Testing("ASSERT all three items loaded");
                loadedInfos = repo.LoadAgencyInfos(meta.SerialNumber);
                Assert.AreEqual(3, loadedInfos.Count);
                Assert.IsTrue(loadedInfos.Any(info => info.Name == "One"));
                Assert.IsTrue(loadedInfos.Any(info => info.Name == "Two"));
                Assert.IsTrue(loadedInfos.Any(info => info.Name == "Three"));
            }
            finally
            {
                Logger.Testing("finally, must delete the records that were created");
                loadedInfos.ToList().ForEach(info => repo.Delete(info.Clone())); // have to clone to get around context issues
                repo.Delete(meta);
            }

        }

        #endregion

        #region LoadNonExistsSerialNumberReturnsNull

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void LoadNonExistsSerialNumberReturnsNull()
        {
            Logger.Testing("ARRANGE create the repo (auto connects to UAt)");
            var repo = new CentralRepository();
            
            Logger.Testing("ACT load th record");
            var loaded = repo.LoadAgencyInfoMeta("DoesNotExist");
            Logger.Testing("ASSERT is null");
            Assert.IsNull(loaded);

        }

        #endregion

        #region CreateAndLoadAgencyInfoMetaReturnsExistingRecord

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void CreateAndLoadAgencyInfoMetaReturnsExistingRecord()
        {
            Logger.Testing("ARRANGE create the repo (auto connects to UAt)");
            var repo = new CentralRepository();
            
            Logger.Testing("ARRANGE first need to create the record");

            var meta = repo.CreateAgencyInfoMeta(SerialNumber, ClientCode, AgencyName, AgencyInfoMeta.Types.Test);

            try
            {
                Logger.Testing("ACT load th record");
                var loaded = repo.LoadAgencyInfoMeta(SerialNumber);
                
                Logger.Testing("ASSERT");
                Assert.IsNotNull(loaded);
                Assert.AreEqual(ClientCode, loaded.ClientCode);
                Assert.AreEqual(AgencyName, loaded.Name);
                Assert.AreNotEqual(0, loaded.AgencyInfoMetaId);
            }
            finally
            {
                Logger.Testing("finally, must delete the record that was created");
                repo.Delete(meta);
            }
        }

        #endregion
    }
}
