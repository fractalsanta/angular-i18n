using Moq;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Tests.Mocks.Core
{
    internal class TranslationServiceMock : Mock<ITranslationService>
    {
        public TranslationServiceMock()
            : base(MockBehavior.Strict)
        {
            Setup(x => x.GetLocalisationVersion()).Returns(99);
            Setup(x => x.Translate<UI.Areas.Forecasting.Api.Models.Translations>(It.IsAny<string>()))
                        .Returns(new UI.Areas.Forecasting.Api.Models.Translations());
        }
    }
}
