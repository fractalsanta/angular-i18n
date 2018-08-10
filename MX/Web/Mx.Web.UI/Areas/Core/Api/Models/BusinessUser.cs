using System;
using System.ComponentModel;
using AutoMapper;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared.Contracts;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public class BusinessUser : IConfigureAutoMapping
    {
        public virtual Int64 Id { get; set; }
        public virtual String UserName { get; set; }
        public virtual String FirstName { get; set; }
        public virtual String LastName { get; set; }
        public virtual Int64 EmployeeId { get; set; }
        public virtual String EmployeeNumber { get; set; }
        public virtual String Culture { get; set; }
        public virtual String PinToken { get; set; }
        public virtual BusinessUserStatusEnum Status { get; set; }
        public virtual MobileSettings MobileSettings { get; set; }

        public virtual Permissions Permission { get; set; }
        public virtual Int64[] AssignedLocations { get; set; }

        public virtual Int64 EntityIdBase { get; set; }
        public virtual Int64 EntityTypeId { get; set; }

        public String FormatNameFirstLastId()
        {
            return String.Format("{0} {1} - {2}", FirstName, LastName, Id);
        }

        public enum BusinessUserStatusEnum
        {
            Unknown,
            Active,
            [Description("On Leave")]
            OnLeave,
            Terminated
        }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<UserResponse, BusinessUser>()
                  .ForMember(x => x.MobileSettings, y => y.MapFrom(z => z.MobileSettings))
                  .ForMember(x => x.EntityIdBase, y => y.MapFrom(z => z.EntityId))
                  .ForMember(x => x.AssignedLocations, y => y.MapFrom(z => z.UserStores));

            Mapper.CreateMap<BusinessUser, AuditUser>()
                .ForMember(x => x.EntityId, y => y.MapFrom(z => z.EntityIdBase))
                .ForMember(x => x.CurrentEntityId, y => y.MapFrom(z => z.MobileSettings.EntityId))
                .ForMember(x => x.CurrentEntityName, y => y.MapFrom(z => z.MobileSettings.EntityName));
        }
    }
}