using System;
using System.Collections.Generic;
using AutoMapper;
using Moq;
using Mx.Inventory.Services.Models;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Inventory.Transfer.Api.Models;

namespace Mx.Web.UI.Tests.Mocks.Core
{
    public class MappingEngineMock : Mock<IMappingEngine>
    {
        public MappingEngineMock()
        {
            Setup(x => x.Map<Mx.Inventory.Services.Models.Transfer, TransferResponse>(
                It.IsAny<Mx.Inventory.Services.Models.Transfer>())).Returns(new TransferResponse());
        }
    }
}
