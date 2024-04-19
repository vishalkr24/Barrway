using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Barrway.Security
{
    public class ApiKeyAuthorizationFilterAttribute : AuthorizationFilterAttribute
    {
        private const string ApiKeyHeaderName = "ApiKey";
        private const string ValidApiKey = "2a85f7c8-4b3d-11e9-8647-d663bd873d93"; // Replace with your actual API key

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (!actionContext.Request.Headers.Contains(ApiKeyHeaderName))
            {
                actionContext.Response = actionContext.Request.CreateErrorResponse(
                    HttpStatusCode.Unauthorized, "Missing API Key");
                return;
            }

            var apiKey = actionContext.Request.Headers.GetValues(ApiKeyHeaderName).FirstOrDefault();

            if (!IsValidApiKey(apiKey))
            {
                actionContext.Response = actionContext.Request.CreateErrorResponse(
                    HttpStatusCode.Unauthorized, "Invalid API Key");
                return;
            }

            base.OnAuthorization(actionContext);
        }

        private bool IsValidApiKey(string apiKey)
        {
            // Add your logic to validate the API key
            return apiKey == ValidApiKey;
        }
    }
}