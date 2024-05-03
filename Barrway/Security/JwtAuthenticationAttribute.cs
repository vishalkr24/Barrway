using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Threading;
using System.Web;
using System.Web.Http.Filters;
using Barrway.DTO.APIModels.Account;

namespace Barrway.Security
{
    public class JwtAuthenticationAttribute : Attribute, IAuthenticationFilter
    {
        public string Realm { get; set; }
        public bool AllowMultiple => false;

        public async Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            var request = context.Request;
            var authorization = request.Headers.Authorization;


            if (string.IsNullOrEmpty(authorization?.ToString()))
            {
                context.ErrorResult = new AuthenticationFailureResult("Missing Jwt Token", request);
                return;
            }

            var token = authorization.ToString();
            if (token.StartsWith("Bearer ") || token.StartsWith("bearer "))
            {
                token = authorization.Parameter;
                var principal = await AuthenticateJwtToken(token);

                if (principal == null)
                    context.ErrorResult = new AuthenticationFailureResult("Invalid token", request);

                else
                    context.Principal = principal;
            }
            else
            {
                var principal = await AuthenticateJwtToken(token);

                if (principal == null)
                    context.ErrorResult = new AuthenticationFailureResult("Invalid token", request);

                else
                    context.Principal = principal;
            }
        }

        private static bool ValidateToken(string token, ref UserClaimViewModel userClaim)
            {
            userClaim = null;

            var simplePrinciple = TokenManager.GetPrincipal(token);
            var identity = simplePrinciple?.Identity as ClaimsIdentity;

            if (identity == null)
                return false;

            if (!identity.IsAuthenticated)
                return false;

            var usernameClaim = identity.FindFirst(ClaimTypes.Name);
            var roleClaim = identity.FindFirst(ClaimTypes.Role);
            var emailClaim = identity.FindFirst(ClaimTypes.Email);

            userClaim = new UserClaimViewModel()
            {
                username = usernameClaim.Value,
                role = roleClaim.Value,
                email=emailClaim.Value
            };

            if (string.IsNullOrEmpty(userClaim.username) || string.IsNullOrEmpty(userClaim.role) || string.IsNullOrEmpty(userClaim.email))
                return false;

            // More validate to check whether username exists in system

            return true;
        }

        protected Task<IPrincipal> AuthenticateJwtToken(string token)
        {
            UserClaimViewModel userClaim = null;
            if (ValidateToken(token, ref userClaim))
            {
                // based on username to get more information from database in order to build local identity
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, userClaim.username),
                    new Claim(ClaimTypes.Role, userClaim.role),
                    new Claim(ClaimTypes.Email, userClaim.email)
                    // Add more claims if needed: Roles, ...
                };

                var identity = new ClaimsIdentity(claims, "Jwt");
                IPrincipal user = new ClaimsPrincipal(identity);

                return Task.FromResult(user);
            }

            return Task.FromResult<IPrincipal>(null);
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            Challenge(context);
            return Task.FromResult(0);
        }

        private void Challenge(HttpAuthenticationChallengeContext context)
        {
            string parameter = null;

            if (!string.IsNullOrEmpty(Realm))
                parameter = "realm=\"" + Realm + "\"";

            context.ChallengeWith("Bearer", parameter);
        }
    }
}