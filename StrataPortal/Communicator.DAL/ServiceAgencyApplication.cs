using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CommunicatorDto;

namespace Communicator.DAL
{
    public partial class ServiceAgencyApplication
    {
        public override string ToString()
        {
            return string.Format("[SAA:{0}] {1} key:{2} active:{3}"
                , ServiceAgencyApplicationID, ServiceID, ApplicationKey, IsActive);
        }

        partial void OnCreated()
        {
            // default to now
            Created = DateTimeOffset.UtcNow;
            Updated = DateTimeOffset.UtcNow;
        }

        public int ApplicationKey { get; set; }

        #region static dto conversion methods

        public ServiceAgencyApplicationDTO ToDto()
        {
            var result = new ServiceAgencyApplicationDTO
            {
                AgencyApplicationId = AgencyApplicationID,
                IsActive = IsActive,
                ServiceAgencyApplicationId = ServiceAgencyApplicationID,
                ServiceId = ServiceID,
                ApplicationKey = ApplicationKey
            };
            return result;
        }

        public static ServiceAgencyApplication ToEntity(ServiceAgencyApplicationDTO dto)
        {
            var result = new ServiceAgencyApplication
            {
                AgencyApplicationID = dto.AgencyApplicationId,
                IsActive = dto.IsActive,
                ServiceAgencyApplicationID = dto.ServiceAgencyApplicationId,
                ServiceID = dto.ServiceId,
                ApplicationKey = dto.ApplicationKey,
                Updated = DateTimeOffset.UtcNow
            };
            return result;
        }

        public static List<ServiceAgencyApplicationDTO> ToDtoList(List<ServiceAgencyApplication> entityList)
        {
            var result = new List<ServiceAgencyApplicationDTO>();

            foreach (var entity in entityList)
            {
                result.Add(entity.ToDto());
            }

            return result;
        }

        #endregion
    }
}
