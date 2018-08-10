using System;
using System.Configuration;
using System.Web.Profile;

namespace Mx.Web.Shared.Providers
{
    public class MxProfileProvider : ProfileProvider
    {
        private static IDependencyContainer Container { get; set; }

        public static void SetContainer(IDependencyContainer container)
        {
            Container = container;
        }

        #region ProfileProvider overrides

        public override SettingsPropertyValueCollection GetPropertyValues(SettingsContext sc, SettingsPropertyCollection properties)
        {
            var svc = new SettingsPropertyValueCollection();

            if (properties.Count < 1)
                return svc;

            var userNameValue = (String)sc["UserName"];

            foreach (SettingsProperty prop in properties)
            {
                svc.Add(new SettingsPropertyValue(prop));
            }

            if (!String.IsNullOrEmpty(userNameValue))
            {
                var provider = Container.Resolve<IProviderCache>();

                svc["BusinessUser"].PropertyValue = provider.GetUser(userNameValue);
            }

            return svc;
        }

        public override void SetPropertyValues(SettingsContext context, SettingsPropertyValueCollection collection)
        {
        }

        public override String ApplicationName { get; set; }

        #endregion

        #region Not implemented as not needed

        public override Int32 DeleteProfiles(ProfileInfoCollection profiles)
        {
            return 0;
        }

        public override Int32 DeleteProfiles(String[] usernames)
        {
            return 0;
        }

        public override Int32 DeleteInactiveProfiles(ProfileAuthenticationOption authenticationOption, DateTime userInactiveSinceDate)
        {
            return 0;
        }

        public override Int32 GetNumberOfInactiveProfiles(ProfileAuthenticationOption authenticationOption, DateTime userInactiveSinceDate)
        {
            return 0;
        }

        public override ProfileInfoCollection GetAllProfiles(ProfileAuthenticationOption authenticationOption, Int32 pageIndex, Int32 pageSize, out Int32 totalRecords)
        {
            totalRecords = 0;
            return null;
        }

        public override ProfileInfoCollection GetAllInactiveProfiles(ProfileAuthenticationOption authenticationOption, DateTime userInactiveSinceDate, Int32 pageIndex, Int32 pageSize, out Int32 totalRecords)
        {
            totalRecords = 0;
            return null;
        }

        public override ProfileInfoCollection FindProfilesByUserName(ProfileAuthenticationOption authenticationOption, string usernameToMatch, Int32 pageIndex, Int32 pageSize, out Int32 totalRecords)
        {
            totalRecords = 0;
            return null;
        }

        public override ProfileInfoCollection FindInactiveProfilesByUserName(ProfileAuthenticationOption authenticationOption, string usernameToMatch, DateTime userInactiveSinceDate, int pageIndex, int pageSize, out int totalRecords)
        {
            totalRecords = 0;
            return null;
        }
        #endregion
    }
}



