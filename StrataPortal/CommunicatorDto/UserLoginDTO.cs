using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace CommunicatorDto
{
    public enum UserType
    {
        NotInRest = -1, Owner = 1000, Tenant = 1001
    }

    /// <summary>
    /// Note that the user can change the 'meaning' of all but Active and Inactive in REST
    /// </summary>
    [Serializable]
    public enum AccountStatusInREST
    {
        Active = -1, 
        Casual = 2,
        Delete = 3,
        Inactive = 0,
        Prospect = 1,
        UserDefined=99
    }
    

    [DataContract]
    [Serializable]
    public class UserLoginDTO
    {
        public override string ToString()
        {
            return string.Format("[{0}] appKey:{1} name:{2}", UserLoginId, ApplicationKey, FullName);
        }

        public void SetAccountStatusInRest(int status)
        {
            AccountStatusInREST = status > 3
                ? AccountStatusInREST.UserDefined 
                : (AccountStatusInREST) status;
        }

        #region Private data
        private string password = string.Empty;
        private bool? accessGranted = null;
        private AccountStatusInREST accountStatusInREST;
        #endregion

        #region CONSTRUCTORS

        public UserLoginDTO()
        {
        }

        #endregion

        #region Properties
        /// <summary>
        /// Gets the UserLoginId. This is a primary key column.
        /// </summary>
        [DataMember]
        public int UserLoginId { get; set; }

        /// <summary>
        /// Gets the ApplicationKey. 
        /// </summary>
        [DataMember]
        public int ApplicationKey { get; set; }

        /// <summary>
        /// Gets the UserTypeId. 
        /// </summary>
        [DataMember]
        public int UserTypeId { get; set; }

        /// <summary>
        /// Gets the OriginalUserId. 
        /// </summary>
        [DataMember]
        public int? OriginalUserId { get; set; }

        /// <summary>
        /// Gets the FullName. 
        /// </summary>
        [DataMember]
        public string FullName { get; set; }

        /// <summary>
        /// Gets the UserName. 
        /// </summary>
        [DataMember]
        public string UserName { get; set; }

        /// <summary>
        /// Gets the Password. 
        /// </summary>
        [DataMember]
        public string Password
        {
            get { return password; } 
            set
            {
                if (!string.IsNullOrEmpty(password))
                    Changed = true;

                password = value;
            }
        }

        /// <summary>
        /// Gets the AccessGranted. 
        /// </summary>
        [DataMember]
        public Boolean AccessGranted
        {
            get { return accessGranted ?? false; } 
            set
            {
                if (accessGranted.HasValue)
                    Changed = true;

                accessGranted = value;
            }
        }

        [DataMember]
        public AccountStatusInREST AccountStatusInREST
        {
            get { return this.accountStatusInREST; }
            set { this.accountStatusInREST = value; }
        }


        /// <summary>
        /// Gets the LastLogin. 
        /// </summary>
        [DataMember]
        public DateTime? LastLogin { get; set; }

        /// <summary>
        /// Gets a print friendly timestamp for the last login
        /// </summary>
        public string LastLoginText 
        { 
            get
            {
                if (LastLogin.HasValue)
                {
                    DateTime localConvertedTime = TimeZoneInfo.ConvertTimeFromUtc(LastLogin.Value, TimeZoneInfo.Local);
                    return string.Concat(localConvertedTime.ToShortDateString(), " ", localConvertedTime.ToShortTimeString());
                }
                else
                {
                    return " --";
                }
            } 
        }

        [DataMember]
        public DateTime CreatedDate { get; set; }

        public bool Changed { get; set; }

        public string UserTypeName
        {
            get
            {
                if (UserTypeId == 1000)
                    return "Owner";
                else if (UserTypeId == 1001)
                    return "Tenant";
                else
                    return "";
            }
        }

        public string DisplayStatus
        {
            get
            {
                if (accountStatusInREST == AccountStatusInREST.Active)
                    return "Active";

                return "Inactive";
            }
        }
        #endregion

        #region UserType conversions
        #endregion

        #region Testing
        /// <summary>
        /// Testing use only
        /// </summary>
        public static class Testing
        {
            public const int RockSchoolApplicationKey = 352928;
            /// <summary>
            /// Get a UserLogin that does not already exist in the db.
            /// </summary>
            public static UserLoginDTO GetOwnerNewLogin()
            {
                return new UserLoginDTO
                {
                    ApplicationKey = RockSchoolApplicationKey,
                    UserTypeId = (int)UserType.Owner,
                    OriginalUserId = 99999,
                    FullName = "Full Test Name",
                    UserName = "Alpha",
                    Password = "password",
                    AccessGranted = true
                };
            }

            /// <summary>
            /// Get the 'BALDWIN' UserLogin (exists in the db)
            /// </summary>
            public static UserLoginDTO GetBaldwin()
            {
                return new UserLoginDTO
                {
                    ApplicationKey = RockSchoolApplicationKey,
                    UserTypeId = (int)UserType.Owner,
                    OriginalUserId = 21,
                    FullName = "Alex Baldwin",
                    UserName = "BALDWIN",
                    Password = "BA5646",
                    AccessGranted = true
                };
            }

        }
        #endregion

    }
}
