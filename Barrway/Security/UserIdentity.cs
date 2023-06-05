using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace Barrway.Security
{
    public static class UserIdentity
    {
        public static string UserName { get { return HttpContext.Current.User.Identity.Name; } }
        public static string Role
        {
            get
            {
                var identity = (System.Security.Claims.ClaimsIdentity)HttpContext.Current.User.Identity;
                IEnumerable<System.Security.Claims.Claim> claims = identity.Claims;
                string UID = claims.Where(x => x.Type == ClaimTypes.Role).FirstOrDefault().Value;
                return UID;
            }
        }

        public static string UserEmail
        {
            get
            {
                var identity = (System.Security.Claims.ClaimsIdentity)HttpContext.Current.User.Identity;
                IEnumerable<System.Security.Claims.Claim> claims = identity.Claims;
                string UID = claims.Where(x => x.Type == ClaimTypes.Email).FirstOrDefault()?.Value;
                return UID;
            }
        }
    }
}