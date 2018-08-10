using Moq;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Tests.Mocks.Core
{
    /// <summary>
    /// Mock that returns a user with everything authorised.
    /// </summary>
    internal class AuthentificationServiceAuthorisedMock : Mock<IAuthenticationService>
    {
        public AuthentificationServiceAuthorisedMock()
            : base(MockBehavior.Strict)
        {
            Setup(x => x.User).Returns(new BusinessUser
            {
                Culture = "en",
                Id = 99
            });
        }
    }
}
