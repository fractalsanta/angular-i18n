using System;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Serializable]
    public class ReportDataContainer
    {
        public override string ToString()
        {
            return string.Format("plan:{0} rpt:{1} allowExec={2} allowOwner={3}"
                , PlanId, ReportId, AllowedExecutive, AllowedOwner);
        }

        public int ReportId { get; set; }
        public int PlanId { get; set; }
        public bool AllowedOwner { get; set; }
        public bool AllowedExecutive { get; set; }
    }
}
