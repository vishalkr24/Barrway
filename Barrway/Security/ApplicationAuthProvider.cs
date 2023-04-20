using AutoMapper;
using Microsoft.Owin.Security.OAuth;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Barrway.DTO.Common;
using System.Net.Sockets;
using Microsoft.Owin.Security;

namespace Barrway.Security
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ApplicationAuthProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            IAuthService authRepository = DependencyResolver.Current.GetService<AuthService>();
            var user = (await authRepository.GetUser(context.UserName, context.Password,true)).Data;
            if (user!=null)
            {
                string role = user["ROLE_NAME"].ToString();
                string email = user["USER_EMAIL"].ToString();

                var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
                identity.AddClaim(new Claim(ClaimTypes.Email, email));
                context.Validated(identity);
                
            }
            else
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }
        }
    }
}