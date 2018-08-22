using System.Net;
using System.Net.Http;
using System.Text;

namespace Taskmanager.Common
{
    public static class Utils
    {
        public static HttpResponseMessage Invalid(string message)
        {
            var response = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.Unauthorized,
                Content = new StringContent(message, Encoding.UTF8, "text/html")
            };

            return response;
        }
    }
}