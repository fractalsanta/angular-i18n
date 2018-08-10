using System;
using System.Collections.Generic;
using Moq;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Responses;

namespace Mx.Web.UI.Tests.MocksLibrary.Inventory
{
    class TransferQueryServiceMock : Mock<ITransferQueryService>
    {
        public TransferQueryServiceMock()
        {
            Setup(x => x.GetTransferByIdAndEntityId(It.IsAny<Int64>(), It.IsAny<Int64>())).
                Returns(new Mx.Inventory.Services.Contracts.Responses.TransferResponse()
                {
                    Id = 1,
                    CreateDate = DateTime.Now,
                    InitiatedBy = "",
                    RequestingEntityId = 0,
                    Details = GetDetailList()
                });
        }

        private IEnumerable<TransferDetailResponse> GetDetailList()
        {
            var itemList = new List<TransferDetailResponse>();

            var item = new TransferDetailResponse()
            {
                ItemCode = "12354",
                ItemId = 0,
                OnHand = 50,
                Quantity1 = 1,
                Quantity2 = 5,
                Quantity3 = 10,
                Quantity4 = 4,
                TransferCost = 0,
                Unit1 = "EA",
                Unit2 = "CS-25LB",
                Unit3 = "LB",
                Unit4 = "CS-15LB",
                UnitCost = 2.50M,
                Description="Test Description",
                Id =1,
                VendorItemId = 000
            };

            itemList.Add(item);
            return itemList;

        }
    }
}
