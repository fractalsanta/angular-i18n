using System;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Services.Shared.Diagnostic;

namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.SystemTests
{
    public class DiagnosticDatabaseIsAvailable : IDiagnosticTest
    {
        private readonly IEntityQueryService _entityQueryService;
        public DiagnosticDatabaseIsAvailable(IEntityQueryService entityQueryService)
        {
            _entityQueryService = entityQueryService;
        }

        public DiagnosticMessage Test()
        {
            try
            {
                _entityQueryService.GetById(1);
                return new DiagnosticMessage
                {
                    Success = true,
                    Component = "Database connection",
                };
            }
            catch (Exception ex)
            {
                Elmah.ErrorLog.GetDefault(null).Log(new Elmah.Error(ex));
                return new DiagnosticMessage
                {
                    Success = false,
                    Component = "Database connection",
                    Message = "Unable to get entity database configuration probably incorrect, see Elmah"
                };
            }
        }
    }
}