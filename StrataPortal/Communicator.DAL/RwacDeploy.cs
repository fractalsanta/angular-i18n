using System;
using Agile.Diagnostics.Logging;
using Rockend.Common;

namespace Communicator.DAL
{
    public partial class RwacDeploy
    {
        public override string ToString()
        {
            return string.Format("[{0}] {1} attempts:{2} cv:{3} dv:{4}", RwacDeployId, AppKey, Attempts, CurrentVersion, DeployVersion);
        }

        public void SetLastError(string message)
        {
            if(string.IsNullOrEmpty(message))
                return;
            Logger.Warning(message);
            Updated = DateTimeOffset.UtcNow;
            LastError = message.Substring(0, Math.Min(1024, message.Length));
        }

        public bool ShouldBeDelayed()
        {
            // allow 4 minutes for the deployment to complete 
            if (LastAttempt.HasValue && LastAttempt.Value.AddMinutes(4) > DateTimeOffset.UtcNow)
                return true;

            // if it has failed at least once then wait longer between attempts
            if (Attempts > 1)
            {
                if (LastAttempt.HasValue && LastAttempt.Value.AddMinutes(Attempts * 4) > DateTimeOffset.UtcNow)
                    return true;
            }
            return false;
        }

        public static RwacDeploy Build(AgencyApplication app, string newVersion, string createdBy, bool isBeta = false)
        {
            return new RwacDeploy
            {
                AppKey = Safe.Int(app.ApplicationKey),
                CurrentVersion = app.RWACVersion.ToString(),
                DeployVersion = newVersion,
                IsBeta = isBeta,
                CreatedBy = createdBy,
                Created = DateTimeOffset.UtcNow,
                Updated = DateTimeOffset.UtcNow
            };
        }

//        private void UpdateValues(RwacDeploy item)
//        {
//            AppKey = item.AppKey;
//            CurrentVersion = item.CurrentVersion;
//            DeployVersion = item.DeployVersion;
//            IsBeta = item.IsBeta;
//            Attempts = item.Attempts;
//            LastAttempt = item.LastAttempt;
//            UpdateConfirmed = item.UpdateConfirmed;
//
//            Updated = DateTimeOffset.UtcNow;
//        }
    }
}