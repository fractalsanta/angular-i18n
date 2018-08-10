using System;
using Moq;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;

namespace Mx.Web.UI.Tests.MocksLibrary.Administration
{
    internal class MxDayQueryServiceMock : Mock<IMxDayQueryService>
    {
        public MxDayQueryServiceMock()
            : base(MockBehavior.Strict)
        {
        }

        public void SetBusinessDate(DateTime date)
        {
             Setup(x => x.GetForTradingDate(It.IsAny<MxDayRequest>())).Returns(
                 new MxDayResponse
                 {
                     CalendarDay = date
                 }
                 ).Verifiable();
        }
    }
}
