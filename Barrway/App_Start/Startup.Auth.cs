using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Owin;
using Barrway.Security;
using Microsoft.Owin.Security;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.Facebook;

namespace Barrway
{
    public partial class Startup
    {
        // For more information on configuring authentication, please visit https://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {



            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                //LoginPath = new PathString("/Account/Login"),
                SlidingExpiration = true,
                CookieName = "BarrwayCookie",
            });
            app.UseCors(CorsOptions.AllowAll);

            OAuthAuthorizationServerOptions option = new OAuthAuthorizationServerOptions
            {
                
                TokenEndpointPath = new PathString("/token"),
                Provider = new ApplicationAuthProvider(),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(30)
            };
            app.UseOAuthAuthorizationServer(option);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());


            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");


            app.UseFacebookAuthentication(
                appId: "1042227183429562",
                appSecret: "045a749a278f0f3b3f4d17221d37beb4"
            );

            app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "699323414558-k1mf1q0pi17sr526udqfsm2p1s726fin.apps.googleusercontent.com",
                ClientSecret = "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"
            });

        }
    }
}