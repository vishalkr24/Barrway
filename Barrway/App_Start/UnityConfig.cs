using AutoMapper;
using Barrway.Mapping;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using NLog;
using System;

using Unity;
using Unity.Injection;

namespace Barrway
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public static class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container =
          new Lazy<IUnityContainer>(() =>
          {
              var container = new UnityContainer();
              RegisterTypes(container);
              return container;
          });

        /// <summary>
        /// Configured Unity Container.
        /// </summary>
        public static IUnityContainer Container => container.Value;
        #endregion

        /// <summary>
        /// Registers the type mappings with the Unity container.
        /// </summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>
        /// There is no need to register concrete types such as controllers or
        /// API controllers (unless you want to change the defaults), as Unity
        /// allows resolving a concrete type even if it was not previously
        /// registered.
        /// </remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below.
            // Make sure to add a Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your type's mappings here.
            // container.RegisterType<IProductRepository, ProductRepository>();
            
            var mapper = AutoMapperConfiguration.InitializeAutoMapper().CreateMapper();
            container.RegisterInstance<IMapper>(mapper);
            container.RegisterType<ILogger>(new InjectionFactory(c =>{return LogManager.GetCurrentClassLogger();}));
            container.RegisterType<IAuthService, AuthService>();
            container.RegisterType<ISqlFunction, SqlFunction>();
            container.RegisterType<IFormAPIRepository, FormAPIRepository>();
            container.RegisterType<ISignupService, SignupService>();
            container.RegisterType<IBusinessUserService, BusinessUserService>();
            container.RegisterType<IGlobalMasterService, GlobalMasterService>();
            container.RegisterType<IMasterService, MasterService>();
            container.RegisterType<ICalendarService, CalendarService>();
            container.RegisterType<IPublicUserService, PublicUserService>();
            container.RegisterType<ISuperAdminUserService, SuperAdminUserService>();

        }
    }
}