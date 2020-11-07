using System;

namespace Communicator.DAL
{
    public partial class AgencyInfo
    {
        partial void OnCreated()
        {
            Created = DateTimeOffset.UtcNow;
        }

        public override string ToString()
        {
            return string.Format("[{0}] {1}", Name, Value);
        }

        /// <summary>
        /// Use when get context issues like "An attempt has been made to Attach or Add an entity that is not new, perhaps having been loaded from another DataContext.  This is not supported."
        /// </summary>
        public AgencyInfo Clone()
        {
            var clone = new AgencyInfo
            {
                Name = Name,
                Value = Value,
                AgencyInfoMetaId = AgencyInfoMetaId,
                Created = Created,
                GroupId = GroupId,
                Updated = Updated,
                Id = Id
            };
            
            return clone;
        }
    }
}