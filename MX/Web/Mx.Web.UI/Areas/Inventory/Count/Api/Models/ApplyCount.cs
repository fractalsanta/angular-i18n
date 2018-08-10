using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using System;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class ApplyCount : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public String CountTypeName { get; set; }
        public Boolean Applied { get; set; }
        public Boolean MonthlyCountAlreadyExists { get; set; }
        public Boolean IsDuplicateApplyDate { get; set; }
        public DateTime? ApplyDate { get; set; }
       
        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<ApplyCountResponse, ApplyCount>();
        }
    }
}