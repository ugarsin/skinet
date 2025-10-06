using API.Errors;
using System.Net;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly IHostEnvironment _hostEnvironment;
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(
            IHostEnvironment hostEnvironment, 
            RequestDelegate next
        )
        {
            _hostEnvironment = hostEnvironment;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, _hostEnvironment);
            }
        }

        private static Task HandleExceptionAsync(
            HttpContext context, 
            Exception ex, 
            IHostEnvironment hostEnvironment
        )
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            
            var response = hostEnvironment.IsDevelopment() ?
                    new ApiErrorResponse(context.Response.StatusCode, ex.Message, ex.StackTrace)
                    :
                    new ApiErrorResponse(context.Response.StatusCode, ex.Message, "Internal server error");
            var options = new JsonSerializerOptions {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            var json = JsonSerializer.Serialize(response, options);

            return context.Response.WriteAsync(json);
        }
    }
}
