using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon
{
    public enum Role
    {
        Unknown = 0,
        Owner = 1,
        ExecutiveMember = 2
    }

    public static class RoleInfo
    {
        public const string RoleNameOwner = "Owner";
        public const string RoleNameExecMember = "Committee Member";
        public const string RoleNameOwnerAndExec = "Owner,Committee Member";

        public static readonly IDictionary<Role, string> RoleList = new Dictionary<Role, string>()
        {
            { Role.Owner, RoleNameOwner },
            { Role.ExecutiveMember, RoleNameExecMember }
        };
    }
}
