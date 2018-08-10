using System;
using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Forecasting.Api;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Tests.Mocks.Core;
using Mx.Web.UI.Tests.MocksLibrary.Inventory;
using Mx.Web.UI.Tests.MocksLibrary.Administration;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Web.UI.Areas.Inventory.Transfer.Api;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Core.Api.Models;
using System.Collections.Generic;


namespace Mx.Web.UI.Tests.Areas.Inventory.Transfer
{
    [TestClass]
    public class TransferControllerTests
    {

        private Mock<IAuthenticationService> _auth;
        private TransferController _controller;
        private TransferQueryServiceMock _transferQueryService;
        private Mock<ITransferCommandService> _transferCommandService;
        private Mock<IInventoryCountCommandService> _inventoryCountCommandService;
        private MappingEngineMock _mappingEngine;
        

        [TestInitialize]
        public void InitializeTest()
        {
            _auth = new Mock<IAuthenticationService>();
            _auth.Setup(p => p.User).Returns(new UI.Areas.Core.Api.Models.BusinessUser
            {
                Permission = new Permissions { AllowedTasks = new[] { Task.Inventory_Transfers_CanRequestTransferIn, Task.Inventory_Transfers_CanCreateTransferOut } },
                MobileSettings = new MobileSettings { EntityId = 0 }
            }
            );
            _transferQueryService = new TransferQueryServiceMock();
            _mappingEngine = new MappingEngineMock();
            _transferCommandService = new Mock<ITransferCommandService>();
            _inventoryCountCommandService = new Mock<IInventoryCountCommandService>();
            _controller = new TransferController(_transferQueryService.Object, _mappingEngine.Object, _auth.Object, _transferCommandService.Object, _inventoryCountCommandService.Object, null, null);
        }



        //To-Do: Update with a test for CreateInventoryTransfer
        //[TestMethod]
        //public void GetTransferCostTest()
        //{
        //    var item = new UI.Areas.Inventory.Transfer.Api.Models.TransferableItem()
        //    {
        //        Code="1234",
        //        Conversion = 0,
        //        Description="Test Description",
        //        Id =1,
        //        InventoryIndicator = "0",
        //        TransferUnit1 ="EA",
        //        TransferUnit2 = "CS-25LB",
        //        TransferUnit3 ="LB",
        //        TransferUnit4 = "CS-15LB",
        //        InventoryUnitCost = 2.50M,
        //        PurchaseUnit ="LB",
        //        Suggested = false,
        //        OnHandQuantity = 25,
        //        TransferQty1 = 1,
        //        TransferQty2 = 5,
        //        TransferQty3  = 10,
        //        TransferQty4 = 4,
        //        VendorItemId = 000
        //    };

           

        //    var target = _controller.GetTransferCost(item);

        //    _transferCommandService.Verify<Decimal>(x => x.GetUnitTransferCost(It.IsAny<CreateUnitTransferCostRequest>()), Times.Once(), "Method Failed");
        //}

    }
}
