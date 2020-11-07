using System;
using System.Collections.Generic;
using CommunicatorDto;

namespace Communicator.DAL
{
    /// <summary>
    /// UserLogin
    /// </summary>
    [Serializable]
    public partial class UserLogin
    {
        /// <summary>
        /// override loaded to set createdDate
        /// </summary>
        partial void OnCreated()
        {
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }

        /// <summary>
        /// Sync this login with the data on the provided login
        /// </summary>
        /// <remarks>method created to work around unsupported attach existing
        /// items to a new content in Linq to Sql.
        /// This means we lose concurrency but thats not a concern for current functionality</remarks>
        /// <returns>this</returns>
        public UserLogin Sync(UserLogin userLogin)
        {
            AccessGranted = userLogin.AccessGranted;
            // [shouldn't be editable] AgencyAccessId SerialNo
            FullName = userLogin.FullName;
            Password = userLogin.Password;
            LastLogin = userLogin.LastLogin;
            AccountStatusInREST = userLogin.AccountStatusInREST;

            return this;
        }

        /// <summary>
        /// ctor
        /// </summary>
        public UserLogin(int applicationKey)
        {
            ApplicationKey = applicationKey;
        }


        /// <summary>
        /// Returns true if the user has access and has provided the correct password
        /// </summary>
        public bool ValidateUser(string password)
        {
            return (AccessGranted && Password == password);
        }

        public string LastLoginText 
        {
            get 
            {
                if (! LastLogin.HasValue)
                    return string.Empty;
                return LastLogin.Value.ToLocalTime().ToString("dd-MMM-yy HH:mm");
            }
        }

        #region Static dto conversion methods

        public UserLoginDTO ToDto()
        {
            UserLoginDTO result = new UserLoginDTO
            {
                AccessGranted = this.AccessGranted,
                ApplicationKey = this.ApplicationKey,
                FullName = this.FullName,
                LastLogin = this.LastLogin,
                OriginalUserId = this.OriginalUserId,
                Password = this.Password,
                UserLoginId = this.UserLoginId,
                UserName = this.UserName,
                UserTypeId = this.UserTypeId,
                CreatedDate = this.CreatedDate,
                AccountStatusInREST = this.AccountStatusInREST.Equals(1) ? CommunicatorDto.AccountStatusInREST.Active : CommunicatorDto.AccountStatusInREST.Inactive
            };
            return result;
        }

        public static UserLogin FromDto(UserLoginDTO dto)
        {
            UserLogin result = new UserLogin
            {
                AccessGranted = dto.AccessGranted,
                ApplicationKey = dto.ApplicationKey,
                FullName = dto.FullName,
                LastLogin = dto.LastLogin,
                OriginalUserId = dto.OriginalUserId,
                Password = dto.Password,
                UserLoginId = dto.UserLoginId,
                UserName = dto.UserName,
                UserTypeId = dto.UserTypeId,
                CreatedDate = dto.CreatedDate,
                AccountStatusInREST = dto.AccountStatusInREST == CommunicatorDto.AccountStatusInREST.Active ? 1 : 0
            };
            return result;
        }

        public static List<UserLoginDTO> ToDtoList(List<UserLogin> entityList)
        {
            List<UserLoginDTO> result = new List<UserLoginDTO>();

            foreach (var userLogin in entityList)
            {
                result.Add(userLogin.ToDto());
            }

            return result;
        }

        #endregion

        /// <summary>
        /// Testing use only!
        /// </summary>
        public static class Testing
        {
            public static UserLogin GetTestLogin()
            {
                return new UserLogin
                    {
                        ApplicationKey = DefaultApplicationKey,
                        AccessGranted = true,
                        Password = "passmee",
                        UserName = "Mee",
                        FullName = "Full",
                        UserTypeId = 1000
                    };
            }


            public static UserLogin GetUserThree(int applicationKey = DefaultApplicationKey)
            {
                return new UserLogin
                {
                    ApplicationKey = applicationKey,
                    AccessGranted = true,
                    Password = "Three",
                    UserName = "Three",
                    FullName = "Three",
                    UserTypeId = 1001
                };
            }

            public static UserLogin GetUserTwo(int applicationKey = DefaultApplicationKey)
            {
                return new UserLogin
                {
                    ApplicationKey = applicationKey,
                    AccessGranted = true,
                    Password = "Two",
                    UserName = "Two",
                    FullName = "Two",
                    UserTypeId = 1000
                };
            }

            public const int DefaultApplicationKey = 1234;

            public static UserLogin GetUserOne(int applicationKey = DefaultApplicationKey)
            {
                return new UserLogin
                {
                    ApplicationKey = applicationKey,
                    AccessGranted = true,
                    Password = "One",
                    UserName = "One",
                    FullName = "One",
                    UserTypeId = 1000
                };
            }
        }
    }
}