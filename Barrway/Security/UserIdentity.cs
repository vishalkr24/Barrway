using Microsoft.Owin.Security;
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

        public static string UserID
        {
            get
            {
                var identity = (System.Security.Claims.ClaimsIdentity)HttpContext.Current.User.Identity;
                IEnumerable<System.Security.Claims.Claim> claims = identity.Claims;
                string UID = claims.Where(x => x.Type == ClaimTypes.Sid).FirstOrDefault().Value;
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


        public static string UpdateClaim(string ClaimType, string newValue)
        {
            var identity = HttpContext.Current.User.Identity as ClaimsIdentity;
            
            // check for existing claim and remove it
            var existingClaim = identity.FindFirst(ClaimType);
            if (existingClaim != null)
                identity.RemoveClaim(existingClaim);

            // add new claim
            identity.AddClaim(new Claim(ClaimType, newValue));

            var authenticationManager = HttpContext.Current.GetOwinContext().Authentication;
            authenticationManager.AuthenticationResponseGrant = new AuthenticationResponseGrant(new ClaimsPrincipal(identity), new AuthenticationProperties() { IsPersistent = true });
            return "Success";
        }
    }
}