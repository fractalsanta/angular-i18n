using System.Collections.Generic;
using Rockend.iStrata.StrataCommon;
using Rockend.iStrata.StrataCommon.Request;
using Rockend.iStrata.StrataCommon.Response;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    /// <summary>
    /// Interface for the data retrieval methods.
    /// </summary>
    public interface IMessenger
    {
        /// <summary>
        /// Gets the agency info.
        /// </summary>
        /// <returns>AgencyResponse with the agency info.</returns>
        AgencyResponse GetAgencyInfo();

        /// <summary>
        /// Gets the budget info.
        /// </summary>
        /// <param name="ownersCorpIds">The owners corp ids.</param>
        /// <returns>BudgetReportResponse containing a list of budgets for the given owner Ids.</returns>
        BudgetReportResponse GetBudgetInfo(IEnumerable<int> ownersCorpIds);

        /// <summary>
        /// Gets the executive member info.
        /// </summary>
        /// <param name="executiveId">The id of the executive member.</param>
        /// <returns>ExecutiveResponse with the executive member info.</returns>
        ExecutiveResponse GetExecInfo(int executiveId);

        /// <summary>
        /// Login with the given credentials and gets the user info.
        /// </summary>
        /// <param name="applicationKey">The agency code.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="password">The password.</param>
        /// <param name="role">The user role.</param>
        /// <returns>LoginResponse with the user info.</returns>
        LoginResponse Login(int applicationKey, string userName, string password, Role role);

        /// <summary>
        /// Gets the lot info.
        /// </summary>
        /// <param name="executiveId">The id of the lot.</param>
        /// <returns>LotResponse with the lot info.</returns>
        LotResponse GetLotInfo(int lotId);

        /// <summary>
        /// Gets the owner's corporation info.
        /// </summary>
        /// <param name="ownersCorpId">The id of the owner's corporation.</param>
        /// <returns>OwnerResponse with the owner's corporation info.</returns>
        OwnerResponse GetOwnerCorpInfo(int ownersCorpId);

        /// <summary>
        /// Changes the password of the user.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="oldPassword">The old password.</param>
        /// <param name="newPassword">The new password.</param>
        /// <returns>PasswordChangeResponse indicating success or failure.</returns>
        PasswordChangeResponse ChangePassword(string userName, string oldPassword, string newPassword);

        /// <summary>
        /// Get the report.
        /// </summary>
        /// <param name="request">The request with the report name and parameters.</param>
        /// <returns>ReportResponse with the report body.</returns>
        ReportResponse GetReport(ReportRequest request);
    }
}
