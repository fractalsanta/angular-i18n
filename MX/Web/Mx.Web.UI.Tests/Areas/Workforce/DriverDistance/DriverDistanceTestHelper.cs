using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Mx.Deliveries.Services.Contracts.Enums;
using Mx.Deliveries.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models;

namespace Mx.Web.UI.Tests.Areas.Workforce.DriverDistance
{
    public static class DriverDistanceTestHelper
    {
        public static void AssureMappingIsValidForDriverDistanceResponseToDriverDistanceViewModel(DriverDistanceResponse response, DriverDistanceRecord record)
        {
            Assert.AreEqual(response.Id, record.Id,
                "Mapping should map Id to Id.");

            Assert.AreEqual(response.StartDistance, record.StartDistance,
                "Mapping should map StartDistance to StartDistance");

            Assert.AreEqual(response.EndDistance, record.EndDistance,
                "Mapping should map EndDistance to EndDistance");

            Assert.AreEqual(response.SubmitTime, record.SubmitTime,
                "Mapping should map SubmitTime to SubmitTime.");

            Assert.AreEqual((Int32)response.Status, (Int32)record.Status,
                "Mapping should map Status to Status.");

            Assert.AreEqual(response.Employee.FirstName + " " + response.Employee.LastName, record.EmployeeName,
                "Mapping should map Employee FirstName and Employee LastName into formatted EmployeeName.");
        }

        public static IEnumerable<DriverDistanceResponse> CreateDriverDistanceResponse(Int32 numberToCreate)
        {
            return Enumerable.Range(1, numberToCreate).Select(i => new DriverDistanceResponse
            {
                Id = i,
                SubmitTime = new DateTime(2015, 12, 5),
                StartDistance = i + 10,
                EndDistance = i + 30,
                Status = DriverDistanceStatus.Pending,
                AuthorizingUser = null,
                Employee = new UserResponse
                {
                    Id = i + 15,
                    EmployeeId = i + 50,
                    FirstName = "Test First Name " + i,
                    MiddleName = "Test Middle Name " + i,
                    LastName = "Test Last Name " + i,
                    EntityId = i + 75
                }
            });
        }
    }
}