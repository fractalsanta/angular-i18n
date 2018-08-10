using System;
using System.Web.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.OperationalReporting.Services.Contracts.CommandService;
using Mx.OperationalReporting.Services.Contracts.Enums;
using Mx.OperationalReporting.Services.Contracts.QueryServices;
using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api;
using Newtonsoft.Json;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Services;
using Mx.OperationalReporting.Services.Contracts.Responses;
using System.Collections.Generic;
using Models = Mx.Web.UI.Areas.Operations.Reporting.Api.Models;

namespace Mx.Web.UI.Tests.Areas.Operations.Api
{
    [TestClass]
    public class ViewControllerTests
    {
        private Mock<IViewQueryService> _viewQueryService;
        private Mock<IViewCommandService> _viewCommandService;
        private Mock<IAuthenticationService> _authenticationService;
        private Mock<IEntityService> _entityService;
        private IReportAttributeService _reportAttrService;

        private const int DefaultEntity = 20;

        [TestInitialize]
        public void Initialise()
        {
            _entityService = new Mock<IEntityService>();
            _entityService.Setup(x => x.CorporateEntityId()).Returns(1);

            Models.ViewModel.ConfigureAutoMapping();

            _viewQueryService = new Mock<IViewQueryService>();

            _viewQueryService.Setup(s => s.GetReportView(It.IsAny<long>(), It.Is<int>(i => i == (int)ReportType.StoreSummary)))
                .Returns(new ViewResponse() { ReportType = ReportType.StoreSummary });
            _viewQueryService.Setup(s => s.GetReportView(It.IsAny<long>(), It.Is<int>(i => i == (int)ReportType.AreaSummary)))
                .Returns(new ViewResponse() { ReportType = ReportType.AreaSummary });

            _viewQueryService.Setup(s => s.GetEntityReportViews(It.Is<long>(i => i % 2 == 0), It.IsAny<ReportType>()));
            _viewQueryService.Setup(s => s.GetEntityReportViews(It.Is<long>(i => i % 2 == 1), It.IsAny<ReportType>()));

            _viewCommandService = new Mock<IViewCommandService>();
            _viewCommandService.Setup(s => s.DeleteView(It.IsAny<long>(), It.IsAny<int>()));
            _viewCommandService.Setup(s => s.UpdatetView(It.IsAny<long>(), It.IsAny<ViewRequest>()));
            _viewCommandService.Setup(s => s.InsertView(It.IsAny<long>(), It.IsAny<ViewRequest>()));

        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void When_deleting_shared_view_and_not_authorised_throw_exception()
        {
            SetupAuthenticationService();
            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService );
            viewController.DeleteView(1, (int)ReportType.StoreSummary, Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType.StoreSummary);
        }

        [TestMethod]
        public void When_deleting_shared_view_and_authorised_do_not_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_StoreSummary_CanAccess, Task.Operations_StoreSummary_CanAccessViewManager, Task.Operations_StoreSummary_CanCreateSharedViews);
            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.DeleteView(1, (int)ReportType.StoreSummary, Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType.StoreSummary);
        }

        # region delete user view
        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void When_deleting_shared_user_view_and_not_authorised_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager);

            var viewId = 101;
            _viewQueryService.Setup(s => s.GetReportView(It.Is<int>(i => i == viewId)))
                .Returns(new ViewResponse() { ReportType = ReportType.AreaSummary, UserId = null });
            
            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.DeleteView(1, viewId, Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType.AreaSummary);
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void When_deleting_user_view_and_not_authorised_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess);

            var viewId = 101;
            _viewQueryService.Setup(s => s.GetReportView(It.Is<int>(i => i == viewId)))
                .Returns(new ViewResponse() { ReportType = ReportType.AreaSummary, UserId = 1 });

            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.DeleteView(1, viewId, Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType.AreaSummary);
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void When_deleting_user_view_not_your_own_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager, Task.Operations_AreaSummary_CanCreateSharedViews);

            var viewId = 101;
            _viewQueryService.Setup(s => s.GetReportView(It.Is<int>(i => i == viewId)))
                .Returns(new ViewResponse() { ReportType = ReportType.AreaSummary, UserId = 2 });

            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.DeleteView(1, viewId, Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType.AreaSummary);
        }

        [TestMethod]
        public void When_deleting_shared_user_view_and_authorised_do_not_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager, Task.Operations_AreaSummary_CanCreateSharedViews);

            var viewId = 101;
            _viewQueryService.Setup(s => s.GetReportView(It.Is<int>(i => i == viewId)))
                .Returns(new ViewResponse() { ReportType = ReportType.AreaSummary, UserId = null });

            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.DeleteView(1, viewId, Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType.AreaSummary);
        }

        [TestMethod]
        public void When_deleting_user_view_and_authorised_do_not_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager);

            var viewId = 101;
            _viewQueryService.Setup(s => s.GetReportView(It.Is<int>(i => i == viewId)))
                .Returns(new ViewResponse() { ReportType = ReportType.AreaSummary, UserId = 1 });

            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.DeleteView(1, viewId, Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType.AreaSummary);
        }
        #endregion

        #region create user view
        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void When_creating_shared_user_view_and_not_authorised_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager);

            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.PostCreateView(1, new Models.ViewModel()
            {
                ColumnIds = new List<short> { 0 },
                ReportType = Models.ReportType.AreaSummary,
                UserId = 0
            });
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void When_creating_user_view_and_not_authorised_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess);

            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.PostCreateView(1, new Models.ViewModel()
            {
                ColumnIds = new List<short> { 0 },
                ReportType = Models.ReportType.AreaSummary,
                UserId = 1
            });
        }

        [TestMethod]
        public void When_creating_shared_user_view_and_authorised_do_not_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager, Task.Operations_AreaSummary_CanCreateSharedViews);

            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.PostCreateView(1, new Models.ViewModel()
            {
                ColumnIds = new List<short> { 0 },
                ReportType = Models.ReportType.AreaSummary,
                UserId = 0
            });
        }

        [TestMethod]
        public void When_creating_user_view_and_authorised_do_not_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager);

            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.PostCreateView(1, new Models.ViewModel()
            {
                ColumnIds = new List<short> { 0 },
                ReportType = Models.ReportType.AreaSummary,
                UserId = 1
            });
        }
        #endregion

        #region update user view
        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void When_updating_shared_user_view_and_not_authorised_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager);
            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.PutUpdateView(1, new Models.ViewModel()
            {
                ColumnIds = new List<short> { 0 },
                ReportType = Models.ReportType.AreaSummary,
                UserId = 0
            });
        }

        [TestMethod]
        [ExpectedException(typeof(HttpResponseException))]
        public void When_updating_user_view_and_not_authorised_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess);
            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.PutUpdateView(1, new Models.ViewModel()
            {
                ColumnIds = new List<short> { 0 },
                ReportType = Models.ReportType.AreaSummary,
                UserId = 1
            });
        }

        [TestMethod]
        public void When_updating_shared_user_view_and_authorised_do_not_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager, Task.Operations_AreaSummary_CanCreateSharedViews);
            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.PutUpdateView(1, new Models.ViewModel()
            {
                ColumnIds = new List<short> { 0 },
                ReportType = Models.ReportType.AreaSummary,
                UserId = 0
            });
        }

        [TestMethod]
        public void When_updating_user_view_and_authorised_do_not_throw_exception()
        {
            SetupAuthenticationService(Task.Operations_AreaSummary_CanAccess, Task.Operations_AreaSummary_CanAccessViewManager);
            var viewController = new ViewController(AutoMapper.Mapper.Engine, _authenticationService.Object, _viewQueryService.Object, _entityService.Object, _viewCommandService.Object, _reportAttrService);
            viewController.PutUpdateView(1, new Models.ViewModel()
            {
                ColumnIds = new List<short> { 0 },
                ReportType = Models.ReportType.AreaSummary,
                UserId = 1
            });
        }
        #endregion

        private void SetupAuthenticationService(params Task[] permissions){
            _authenticationService = new Mock<IAuthenticationService>();
            var businessUser = new BusinessUser
            {
                Id = 1,
                Culture = "Test",
                MobileSettings = new MobileSettings {EntityId = DefaultEntity},
                Permission = new Permissions
                {
                    AllowedTasks = { },
                    Usage = 
                    {
                        {20,0},
                        {21,0}
                    },
                    GroupIds = { 21,22 }

                }
            };

            foreach (var perm in permissions)
            {
                SetPermission(businessUser.Permission, (Int32)perm);
            }

            Console.WriteLine(JsonConvert.SerializeObject(businessUser));
            _authenticationService.Setup(s => s.User).Returns(businessUser);
            _authenticationService.Setup(s => s.UserId).Returns(1);
            _reportAttrService = new ReportAttributeService(_authenticationService.Object);
        }

        private void SetPermission(Permissions permissions, Int32 task)
        {
            var usageIndex = (task / 64) + 1;
            var bit = (task % 64) - 1;
            var mask = (Int64)1 << bit;

            if (permissions.Usage.ContainsKey(usageIndex))
            {
                permissions.Usage[usageIndex] = permissions.Usage[usageIndex] | mask;
            }
        }

    }
}
