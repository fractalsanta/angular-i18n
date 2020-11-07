using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CommunicatorDto;

namespace Communicator.DAL
{
    public partial class Activation
    {
        public int ApplicationKey { get; set; }

        #region static dto conversion methods
        public ActivationDTO ToDto()
        {
            var result = new ActivationDTO()
            {
                ActivationId = this.ActivationId,
                AgencyApplicationId = this.AgencyApplicationID,
                ApplicationKey = this.ApplicationKey,
                Created = this.Created,
                IsActive = this.IsActive,
                MachineName = this.MachineName,
                Updated = this.Updated
            };
            return result;
        }

        public static Activation ToEntity(ActivationDTO dto)
        {
            var result = new Activation()
            {
                ActivationId = dto.ActivationId,
                AgencyApplicationID = dto.AgencyApplicationId,
                ApplicationKey = dto.ApplicationKey,
                Created = dto.Created,
                IsActive = dto.IsActive,
                MachineName = dto.MachineName,
                Updated = dto.Updated
            };
            return result;
        }

        public static List<ActivationDTO> ToDtoList(List<Activation> entity)
        {
            var result = new List<ActivationDTO>();

            foreach (var activation in entity)
            {
                result.Add(activation.ToDto());
            }
            return result;
        }
        #endregion
    }
}
