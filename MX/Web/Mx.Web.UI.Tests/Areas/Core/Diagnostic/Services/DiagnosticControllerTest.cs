using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Moq;
using Mx.Web.UI.Areas.Core.Diagnostics.Api.Services;
using Mx.Web.UI.Areas.Core.Diagnostics.Api.Models;
using Mx.Services.Shared.Diagnostic;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Mx.Web.UI.Tests.Areas.Core.Diagnostic.Services
{
    [TestClass]
    public class DiagnosticControllerTest
    {
        [TestInitialize]
        public void Initialise()
        {
            Mapper.CreateMap<DiagnosticMessage,DiagnosticServiceDetail>();
        }

        
        [TestMethod]
        public void DiagnosticCanHandleNull()
        {
            var service = new DiagnosticController(null, Mapper.Engine);
            var result = service.GetDiagnostic();

            Assert.IsFalse(result.Success, "No tests - should be false");
            Assert.IsTrue(result.Errors.Any(), "With failure comes an error");
            Assert.IsTrue(result.Errors[0].Message.ToLower().Contains("no test"), "With failure comes an error");

        }

        [TestMethod]
        public void DiagnosticCanHandleEmptyList()
        {
            var service = new DiagnosticController(new List<IDiagnosticTest>(), Mapper.Engine);
            var result = service.GetDiagnostic();

            Assert.IsFalse(result.Success, "No tests - should be false");
            Assert.IsTrue(result.Errors.Any(), "With failure comes an error");
            Assert.IsTrue(result.Errors[0].Message.ToLower().Contains("no test"), "With failure comes an error");

        }

        [TestMethod]
        public void DiagnosticCanHandleExceptionInTest()
        {
            var tests = new List<IDiagnosticTest>
            {
                new TestException()
            };

            var service = new DiagnosticController(tests, Mapper.Engine);
            var result = service.GetDiagnostic();

            Assert.IsFalse(result.Success, "Exception tests - should be false");
            Assert.IsTrue(result.Errors.Any(), "With failure comes an error");
            Assert.IsTrue(result.Errors[0].Message.ToLower().Contains("exception"), "Message is about exception");

        }

        [TestMethod]
        public void DiagnosticCanHandleSuccessTest()
        {
            var tests = new List<IDiagnosticTest>
            {
                new TestSucess(),
                new TestSucess(),
            };

            var service = new DiagnosticController(tests, Mapper.Engine);
            var result = service.GetDiagnostic();

            Assert.IsTrue(result.Success, "Exception tests - should be false");
            Assert.IsFalse(result.Errors.Any(), "No failure no error");

        }

        [TestMethod]
        public void DiagnosticCanHandleFailingTest()
        {
            var tests = new List<IDiagnosticTest>
            {
                new TestSucess(),
                new TestFailure(),
            };

            var service = new DiagnosticController(tests, Mapper.Engine);
            var result = service.GetDiagnostic();

            Assert.IsFalse(result.Success, "Exception tests - should be false");
            Assert.IsTrue(result.Errors.Any(), "No failure no error");
            Assert.IsTrue(result.Errors[0].Message.Equals(tests[1].Test().Message), "Message is result " + result.Errors[0].Message);

        }
    }

    public class TestException : IDiagnosticTest
    {

        public DiagnosticMessage Test()
        {
            throw new NotImplementedException();
        }
    }

    public class TestSucess : IDiagnosticTest
    {
        public DiagnosticMessage Test()
        {
            return new DiagnosticMessage
            {
                Component = "success",
                Message = null,
                Success = true,
            };
        }
    }

    public class TestFailure : IDiagnosticTest
    {
        public DiagnosticMessage Test()
        {
            return new DiagnosticMessage
            {
                Component = "failure",
                Message = "Failure test",
                Success = false,
            };
        }
    }

}
