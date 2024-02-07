using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Configuration;
using Stripe;
using System.Globalization;
using Microsoft.AspNet.SignalR;
using Barrway.WebSocket;

namespace Barrway
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(50);


            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            //AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;
            var secretKey = WebConfigurationManager.AppSettings["StripeSecretKey"];
            StripeConfiguration.SetApiKey(secretKey);
            AntiForgeryConfig.SuppressIdentityHeuristicChecks = true;
        }


        protected void Application_BeginRequest(object sender, EventArgs e)

        {
            string culture = CultureInfo.CurrentCulture.Name;
            HttpCookie languageCookie = System.Web.HttpContext.Current.Request.Cookies["Language"];
            if (languageCookie!=null)
            {
                culture = languageCookie.Value;
                CultureInfo cultureInfo = new CultureInfo(culture);
                //var dtfInfo = new DateTimeFormatInfo
                //{
                //    ShortDatePattern = "MM-dd-yyyy",
                //    ShortTimePattern = "HH:mm:ss"
                //};
                //cultureInfo.DateTimeFormat = dtfInfo;
                System.Threading.Thread.CurrentThread.CurrentCulture = cultureInfo;
                System.Threading.Thread.CurrentThread.CurrentUICulture = cultureInfo;
            }
            else
            {
                culture = Convert.ToString("en");
                CultureInfo cultureInfo = new CultureInfo(culture);
                //var dtfInfo = new DateTimeFormatInfo
                //{
                //    ShortDatePattern = "MM-dd-yyyy",
                //    ShortTimePattern = "HH:mm:ss"
                //};
                //cultureInfo.DateTimeFormat = dtfInfo;
                System.Threading.Thread.CurrentThread.CurrentCulture = cultureInfo;
                System.Threading.Thread.CurrentThread.CurrentUICulture = cultureInfo;
            }
        }

        protected void Application_AcquireRequestState()
        {
            string culture = CultureInfo.CurrentCulture.Name;
            HttpCookie languageCookie = System.Web.HttpContext.Current.Request.Cookies["Language"];
            if (languageCookie!=null)
            {
                culture = languageCookie.Value;
                CultureInfo cultureInfo = new CultureInfo(culture);
                //var dtfInfo = new DateTimeFormatInfo
                //{
                //    ShortDatePattern = "MM-dd-yyyy",
                //    ShortTimePattern = "HH:mm:ss"
                //};
                //cultureInfo.DateTimeFormat = dtfInfo;
                System.Threading.Thread.CurrentThread.CurrentCulture = cultureInfo;
                System.Threading.Thread.CurrentThread.CurrentUICulture = cultureInfo;
            }
            else
            {
                culture = Convert.ToString("en");
                CultureInfo cultureInfo = new CultureInfo(culture);
                //var dtfInfo = new DateTimeFormatInfo
                //{
                //    ShortDatePattern = "MM-dd-yyyy",
                //    ShortTimePattern = "HH:mm:ss"
                //};
                //cultureInfo.DateTimeFormat = dtfInfo;
                System.Threading.Thread.CurrentThread.CurrentCulture = cultureInfo;
                System.Threading.Thread.CurrentThread.CurrentUICulture = cultureInfo;
            }
        }


    }
}
