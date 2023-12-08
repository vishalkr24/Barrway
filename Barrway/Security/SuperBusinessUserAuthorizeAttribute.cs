using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Barrway.Security
{
    [AttributeUsageAttribute(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class SuperBusinessUserAuthorize : AuthorizeAttribute
    {
        //Custom named parameters for annotation
        public string ResourceKey { get; set; }
        public string OperationKey { get; set; }
        private static readonly char[] _splitParameter = new char[1]
        {
            ','
        };

        private readonly object _typeId = new object();
        private string _roles;

        private string[] _rolesSplit = new string[0];
        private string _users;

        private string[] _usersSplit = new string[0];


        //
        // Summary:
        //     Gets or sets the user roles that are authorized to access the controller or action
        //     method.
        //
        // Returns:
        //     The user roles that are authorized to access the controller or action method.
        public string Roles
        {
            get
            {
                return _roles ?? string.Empty;
            }
            set
            {
                _roles = value;
                _rolesSplit = SplitString(value);
            }
        }

        //
        // Summary:
        //     Gets the unique identifier for this attribute.
        //
        // Returns:
        //     The unique identifier for this attribute.

        //
        // Summary:
        //     Gets or sets the users that are authorized to access the controller or action
        //     method.
        //
        // Returns:
        //     The users that are authorized to access the controller or action method.
        public string Users
        {
            get
            {
                return _users ?? string.Empty;
            }
            set
            {
                _users = value;
                _usersSplit = SplitString(value);
            }
        }


        //Called when access is denied
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            //User isn't logged in
            if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                filterContext.Result = new RedirectToRouteResult(
                        new RouteValueDictionary(new { controller = "BusinessAdmin", action = "Dashboard" })
                );
            }
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException("httpContext");
            }

            IPrincipal user = httpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                return false;
            }

            if (_usersSplit.Length != 0 && !_usersSplit.Contains(user.Identity.Name, StringComparer.OrdinalIgnoreCase))
            {
                return false;
            }

            if (_rolesSplit.Length != 0 && !_rolesSplit.Any(user.IsInRole))
            {
                return false;
            }
            else
            {
                if (UserIdentity.UserRoleType == "SUPERUSER")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }

            return true;
        }

        internal static string[] SplitString(string original)
        {
            if (string.IsNullOrEmpty(original))
            {
                return new string[0];
            }

            return (from piece in original.Split(_splitParameter)
                    let trimmed = piece.Trim()
                    where !string.IsNullOrEmpty(trimmed)
                    select trimmed).ToArray();
        }
    }
}