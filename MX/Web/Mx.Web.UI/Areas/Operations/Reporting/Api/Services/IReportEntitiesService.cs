using Mx.Web.UI.Areas.Core.Api.Models;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public interface IReportEntitiesService
    {
        IEnumerable<EntityModel> GetEntitiesFromEntityId(long? entityId);
    }
}
