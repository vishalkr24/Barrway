using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Barrway.Security
{
    [AttributeUsageAttribute(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class BusinessAuthorizeAttribute : AuthorizeAttribute
    {
        //Called when access is denied
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            //User isn't logged in
            if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                var url = HttpContext.Current.Request.FilePath;
                filterContext.Result = new RedirectToRouteResult(
                        new RouteValueDictionary(new { controller = "Account", action = "BusinessLogin", returnUrl = url })
                );
            }
        }

        //
        // Summary:
        //     Called when a process requests authorization.
        //
        // Parameters:
        //   filterContext:
        //     The filter context, which encapsulates information for using System.Web.Mvc.AuthorizeAttribute.
        //
        // Exceptions:
        //   T:System.ArgumentNullException:
        //     The filterContext parameter is null.
        public virtual void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }

            //if (OutputCacheAttribute.IsChildActionCacheActive(filterContext))
            //{
            //    throw new InvalidOperationException(MvcResources.AuthorizeAttribute_CannotUseWithinChildActionCache);
            //}

            if (!filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute), inherit: true) && !filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(AllowAnonymousAttribute), inherit: true))
            {
                if (AuthorizeCore(filterContext.HttpContext))
                {
                    HttpCachePolicyBase cache = filterContext.HttpContext.Response.Cache;
                    cache.SetProxyMaxAge(new TimeSpan(0L));
                    //cache.AddValidationCallback(CacheValidateHandler, null);
                }
                else
                {
                    HandleUnauthorizedRequest(filterContext);
                }
            }
        }

    }
}