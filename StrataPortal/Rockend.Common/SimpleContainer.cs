using System;
using System.Linq;
using Agile.Diagnostics.Logging;
using SimpleInjector;

namespace Rockend.Common
{
    /// <summary>
    /// IoC container (using Simple Injector)
    /// This class provides a common easy access point for all (most) Rockend apps to hook into the container.
    /// It's static to make it syntactically as simple as possible.
    /// </summary>
    public static class SimpleContainer
    {
        private static Container container;
        /// <summary>
        /// Gets the underlying Simple Injector container
        /// </summary>
        /// <remarks>if any of the public methods you need are not available on this static
        /// class, just add a static method wrapper.
        /// </remarks>
        private static Container Container
        {
            get { return container ?? (container = new Container()); }
        }

        /// <summary>
        /// Allow replace the existing registrations with this new registrations
        /// </summary>
        public static bool AllowOverridingRegistrations {
            get { return Container.Options.AllowOverridingRegistrations; }
            set { Container.Options.AllowOverridingRegistrations = value; }
        }

        /// <summary>
        /// Useful in unit tests, clear before or after to ensure you know what state the container is in.
        /// Testing use only!
        /// (just sets container to null so a new one is created next time)
        /// </summary>
        public static void ResetContainer()
        {
            Logger.Info("--- Reset Simple Container ---");
            container = null;
        }

        /// <summary>
        ///     Gets an instance of the given TService.
        /// </summary>
        public static TService GetInstance<TService>()
            where TService : class
        {
            return Container.GetInstance<TService>();
        }


        /// <summary>
        ///     Gets an instance of the given serviceType. 
        /// </summary>
        public static object GetInstance(Type serviceType)
        {
            return Container.GetInstance(serviceType);
        }

        /// <summary>
        ///     Registers a singleton instance of TImplementation
        /// </summary>
        public static void RegisterSingle<TService, TImplementation>()
            where TService : class
            where TImplementation : class, TService
        {
            Logger.Info("Register: {0} for {1}", typeof(TImplementation).Name, typeof(TService).Name);
            Container.RegisterSingle<TService, TImplementation>();
        }

        /// <summary>
        ///     Registers a singleton instance of TConcrete.
        /// </summary>
        public static void RegisterSingle<TConcrete>()
            where TConcrete : class
        {
            Container.RegisterSingle<TConcrete>();
        }


        /// <summary>
        ///     Registers a singleton instance of TService
        /// </summary>
        public static void RegisterSingle<TService>(TService instance)
            where TService : class
        {
            Logger.Info("RegisterSingle: {0}", typeof(TService).Name);
            Container.RegisterSingle(instance);
        }

        /// <summary>
        ///     Registers that a new instance of TImplementation will be returned every time
        ///     a TService is requested. 
        /// </summary>
        public static void Register<TService, TImplementation>()
            where TService : class
            where TImplementation : class, TService
        {
            Container.Register<TService, TImplementation>();
        }

        /// <summary>
        ///     Registers that an instance of TImplementation will be returned when an instance
        ///     of type TService is requested. The instance is cached according to the supplied
        ///     lifestyle. 
        /// </summary>
        public static void Register<TService, TImplementation>(Lifestyle lifestyle)
            where TService : class
            where TImplementation : class, TService
        {
            Container.Register<TService, TImplementation>(lifestyle);
        }

        /// <summary>
        ///     Registers that a new instance of TConcrete will be returned every time it
        ///     is requested (transient). Note that calling this method is redundant in most
        ///     scenarios, because the container will return a new instance for unregistered
        ///     concrete types. Registration is needed when the security restrictions of
        ///     the application's sandbox don't allow the container to create such type. 
        /// </summary>
        public static void Register<TConcrete>() 
            where TConcrete : class
        {
            Container.Register<TConcrete>();
        }
        

        /// <summary>
        ///     Registers the specified delegate that allows returning transient instances
        ///     of TService. The delegate is expected to always return a new instance on
        ///     each call. 
        /// </summary>
        public static void Register<TService>(Func<TService> instanceCreator) 
            where TService : class
        {
            Container.Register<TService>(instanceCreator);
        }


        // Summary:
        /// <summary>
        ///     Adds the registration for the supplied serviceType. This method can be used
        ///     to apply the same SimpleInjector.Registration to multiple different service
        ///     types. 
        /// </summary>
        public static void AddRegistration(Type serviceType, Registration registration)
        {
            Container.AddRegistration(serviceType, registration);
        }

        /// <summary>
        /// Returns true if tnere is ANY registration for the type (i.e. doesn't care about Lifecycle)
        /// </summary>
        public static bool HasAnyRegistrationFor<T>()
        {
            var registrations = Container.GetCurrentRegistrations();
            return registrations.Any(producer => producer.ServiceType == typeof (T));
        }
    }
}
