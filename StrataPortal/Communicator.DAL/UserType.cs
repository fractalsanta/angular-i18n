using System;

namespace Communicator.DAL
{
    /// <summary>
    /// User Type (owner or tenant)
    /// </summary>
    [Serializable]
    public partial class UserType
    {
        public override string ToString()
        {
            return string.Format("UserType:{0}", Name);
        }

        /// <summary>
        /// Override of Equals operator. Evaluate if the id is different (important for Lookup types, especially when consider serialization)
        /// </summary>
        public static bool operator ==(UserType a, UserType b)
        {
            // If both are null, or both are same instance, return true.
            if (ReferenceEquals(a, b))
                return true;
            // If one is null, but not both, return false.
            if (((object)a == null) || ((object)b == null))
                return false;
            return a.UserTypeId.Equals(b.UserTypeId);
        }

        /// <summary>
        /// Override of NotEquals operator
        /// </summary>
        public static bool operator !=(UserType a, UserType b)
        {
            return !(a == b);
        }

        /// <summary>
        /// Override Equals
        /// </summary>
        public override bool Equals(object obj)
        {
            return this == obj as UserType;
        }


        /// <summary>
        /// Override of GetHashCode
        /// </summary>
        public override int GetHashCode()
        {
            return UserTypeId;
        }




        private static UserType owner;
        /// <summary>
        /// Gets the owner userType
        /// </summary>
        public static UserType Owner
        {
            get
            {
                if(owner == null)
                    owner = new UserType { UserTypeId = 1000, Name = "Owner"};
                return owner; 
            }
        }

        private static UserType tenant;
        /// <summary>
        /// Gets the Tenant userType
        /// </summary>
        public static UserType Tenant
        {
            get
            {
                if (tenant == null)
                    tenant = new UserType { UserTypeId = 1001, Name = "Tenant" };
                return tenant;
            }
        }

        private static UserType notInRest;
        /// <summary>
        /// Gets the NotInRest usertype
        /// </summary>
        public static UserType NotInRest
        {
            get
            {
                if (notInRest == null)
                    notInRest = new UserType { UserTypeId = -1, Name = "NotInRest" };
                return notInRest;
            }
        }

        /// <summary>
        /// Get the UserType from the id string
        /// </summary>
        public static UserType From(string id)
        {
            if (string.IsNullOrEmpty(id))
                return NotInRest;

            switch (id)
            {
                case "1000":
                    return Owner;
                case "1001":
                    return Tenant;
                default:
                    return NotInRest;
            }
        }
    }
}
