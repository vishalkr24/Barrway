using Swashbuckle.Swagger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Description;
using System.Web.WebSockets;

namespace Barrway.Security
{
    /// <summary>
    /// The class to add the authorization header.
    /// </summary>
    public class AddAuthorizationHeaderParameterOperationFilter : IOperationFilter
    {
        /// <summary>
        /// Applies the operation filter.
        /// </summary>
        /// <param name="operation"></param>
        /// <param name="schemaRegistry"></param>
        /// <param name="apiDescription"></param>
        public void Apply(Operation operation, SchemaRegistry schemaRegistry, ApiDescription apiDescription)
        {
            if (operation.parameters == null)
            {
                operation.parameters = new List<Parameter>();
            }
            operation.parameters.Add(new Parameter
            {
                name = "Authorization",
                @in = "header",
                description = "access token",
                required = false,
                type = "string"
            });
            operation.parameters.Add(new Parameter
            {
                name = "APIKEY",
                @in = "header",
                description = "APIKEY",
                required = false,
                type = "string"
            });

            operation.parameters.Add(new Parameter
            {
                name = "langId",
                @in = "header",
                description = "langId",
                required = false,
                type = "string"
            });
        }
    }
}