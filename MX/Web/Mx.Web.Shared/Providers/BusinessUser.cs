using System;
using System.Collections.Generic;
using System.ComponentModel;
using AutoMapper;
using Mx.Foundation.Services.Contracts.Requests;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Services.Shared.Contracts;

namespace Mx.Web.Shared.Providers
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
        public virtual BusinessUserStatusEnum Status { get; set; }
        public virtual MobileSettings MobileSettings { get; set; }

        public virtual Permissions Permission { get; set; }

        public virtual List<Int64> UserStores { get; set; }

        public virtual Int64 EntityIdBase { get; set; }
        public virtual Int64 EntityTypeId { get; set; }

        public virtual Int64 EntityIdCurrent
        {
            get { return MobileSettings != null ? MobileSettings.EntityId : 0; }
            set { MobileSettings.EntityId = value; }
        }

        public String FormatNameFirstLast()
        {
            return String.Format("{0} {1}", FirstName, LastName);
        }

        public String FormatNameFirstLastId()
        {
            return String.Format("{0} {1} - {2}", FirstName, LastName, Id);
        }
        public virtual Boolean HasPermission(Task task)
        {
            return Permission.HasPermission((Int32)task);
        }

        public virtual Boolean HasPermission(Int32 task)
        {
            return Permission.HasPermission(task);
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
                  .ForMember(x => x.MobileSettings, x => x.MapFrom(y => y.MobileSettings))
                  .ForMember(x => x.EntityIdBase, x => x.MapFrom(y => y.EntityId));
        }
    }

    public class MobileSettings : IConfigureAutoMapping
    {
        public Int64 EntityId { get; set; }
        public String EntityName { get; set; }
        public String EntityNumber { get; set; }
        public Int64[] FavouriteStores { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<UserResponse.MobileSettingsResponse, MobileSettings>();
            Mapper.CreateMap<MobileSettings, MobileSettingsRequest>();

            Mapper.CreateMap<BusinessUser, AuditUser>()
                .ForMember(x => x.EntityId, opt => opt.MapFrom(y => y.EntityIdBase))
                .ForMember(x => x.CurrentEntityId, opt => opt.MapFrom(y => y.MobileSettings.EntityId))
                .ForMember(x => x.CurrentEntityName, opt => opt.MapFrom(y => y.MobileSettings.EntityName));

        }
    }
}