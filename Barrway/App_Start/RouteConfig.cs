using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Barrway
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapMvcAttributeRoutes();
            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}/{Cid}",
            //    defaults: new { controller = "Marketplace", action = "ComingSoon", id = UrlParameter.Optional, Cid = UrlParameter.Optional }
            //);
            routes.MapRoute(
             name: "CatchAll",
             url: "{*url}",
             defaults: new { controller = "Marketplace", action = "ComingSoon" } // Controller and action to which all requests will be routed
         );
        }
    }
}
