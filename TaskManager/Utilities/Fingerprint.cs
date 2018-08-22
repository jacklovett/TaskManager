using System;
using System.IO;
using System.Web;
using System.Web.Caching;
using System.Web.Hosting;

namespace TaskManager.Utilities
{
    public static class Fingerprint
    {
        public static string Get(string relativePath)
        {
            if (HttpRuntime.Cache[relativePath] != null)
            {
                return HttpRuntime.Cache[relativePath] as string;
            }

            var absolute = HostingEnvironment.MapPath("~" + relativePath);

            if (absolute == null)
            {
                return HttpRuntime.Cache[relativePath] as string;
            }

            var date = File.GetLastWriteTime(absolute);
            var index = relativePath.LastIndexOf('/');
            var result = relativePath.Insert(index, "/v-" + date.Ticks);

            
            HttpRuntime.Cache.Insert(relativePath, result, new CacheDependency(absolute));

            return HttpRuntime.Cache[relativePath] as string;
        }
    }
}