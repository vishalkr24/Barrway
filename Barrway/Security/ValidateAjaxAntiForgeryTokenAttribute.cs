using System;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

public class ValidateAjaxAntiForgeryTokenAttribute : AuthorizeAttribute
{
    public override void OnAuthorization(AuthorizationContext filterContext)
    {
        var httpContext = filterContext.HttpContext;
        var request = httpContext.Request;
        var tokenHeader = request.Headers["RequestVerificationToken"];
        if (string.IsNullOrEmpty(tokenHeader))
        {
            filterContext.Result = new HttpStatusCodeResult(400, "Missing anti-forgery token");
            return;
        }

        try
        {
            AntiForgery.Validate(request.Cookies[AntiForgeryConfig.CookieName]?.Value, tokenHeader);
        }
        catch
        {
            filterContext.Result = new HttpStatusCodeResult(400, "Invalid anti-forgery token");
            return;
        }

        base.OnAuthorization(filterContext);
    }
}
