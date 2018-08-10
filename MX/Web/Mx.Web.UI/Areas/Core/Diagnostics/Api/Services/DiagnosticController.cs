using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Services.Shared.Diagnostic;
using Mx.Web.UI.Areas.Core.Diagnostics.Api.Models;


namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.Services
{
    [AllowAnonymous]
    public class DiagnosticController : ApiController
    {
        private readonly List<IDiagnosticTest> _tests;
        private readonly IMappingEngine _mapper;

        public DiagnosticController(IEnumerable<IDiagnosticTest> tests, IMappingEngine mapper)
        {
            if (tests != null)
            {
                _tests = tests.ToList();
            }
            _mapper = mapper;
        }

        public DiagnosticServiceResponse GetDiagnostic()
        {
            var result = new DiagnosticServiceResponse
            {
                Errors = new List<DiagnosticServiceDetail>(),
                Success = true,
            };
            if (_tests == null || ! _tests.Any())
            {
                result.Success = false;
                result.Errors.Add( new DiagnosticServiceDetail
                {
                    Success = false,
                    Component = "Initialise testing",
                    Message = "Warning: No tests configured in system, contact support"
                });
                return result;
            }
            foreach (var diagnosticTest in _tests)
            {
                try
                {
                    var response = diagnosticTest.Test();
                    if (!response.Success)
                    {
                        result.Success = false;
                        result.Errors.Add(_mapper.Map<DiagnosticServiceDetail>(response));
                    }
                }
                catch (Exception ex)
                {
                    result.Success = false;
                    result.Errors.Add(new DiagnosticServiceDetail
                    {
                        Success = false,
                        Component = "API",
                        Message = "Test failed with exception see Elmah: " + diagnosticTest.GetType().FullName
                    });
                    Elmah.ErrorLog.GetDefault(null).Log(new Elmah.Error(ex));
                }
            }

            return result;
        }
    }
}