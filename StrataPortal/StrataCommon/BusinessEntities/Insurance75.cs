using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="Insurance")]
    public class Insurance75
    {
        [Column(Name = "lInsuranceID", IsPrimaryKey = true)]
        public int InsuranceID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "dRenewal")]
        public DateTime Renewal { get; set; }

        [Column(Name = "lPolicyTypeID")]
        public int PolicyTypeID { get; set; }

        /// <summary>
        /// The Insurer 
        /// </summary>
        [Column(Name = "lCreditorID")]
        public int CreditorID { get; set; }

        [Column(Name = "lBrokerID")]
        public int BrokerID { get; set; }

        [Column(Name = "bActive")]
        public string Active { get; set; }

        [Column(Name = "dDatePaid")]
        public DateTime DatePaid { get; set; }

        [Column(Name = "sPolicyNumber")]
        public string PolicyNumber { get; set; }

        [Column(Name = "sNotes")]
        public string Notes { get; set; }

        // new in 75 v-----v

        [Column(Name = "bRecordCommission")]
        public string RecordCommission { get; set; }

        [Column(Name = "mCommissionDue")]
        public decimal CommissionDue { get; set; }

        [Column(Name = "mCommissionReceived")]
        public decimal CommissionReceived { get; set; }
        
        [Column(Name = "dPolicyStartDate")]
        public DateTime PolicyStartDate { get; set; }
    }
}
