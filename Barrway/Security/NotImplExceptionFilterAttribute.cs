using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http;
using NLog;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Results;

namespace Barrway.Security
{
    public class NotImplExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is NotImplementedException)
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent("This method is not implemented"),
                    ReasonPhrase = "Not implemented"
                };
                
                throw new HttpResponseException(resp);
            }
            else
            {
                logger.Error(context.Exception);
            }
        }
    }
    public class GlobalExceptionHandler : ExceptionHandler
    {
        static readonly Logger logger = LogManager.GetCurrentClassLogger();
        public override void Handle(ExceptionHandlerContext context)
        {
            logger.Error(context.Exception);
        }
    }
}