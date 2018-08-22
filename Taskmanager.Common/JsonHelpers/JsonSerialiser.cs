using System.IO;
using System.Runtime.Serialization.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Taskmanager.Common.JsonHelpers
{
    public static class JsonSerialiser
    {
        public static string ToJson<T>(this T objectToSerialise)
        {
            using (var ms = new MemoryStream())
            {
                var js = new DataContractJsonSerializer(typeof(T));
                js.WriteObject(ms, objectToSerialise);
                ms.Position = 0;

                using (var sr = new StreamReader(ms))
                {
                    return sr.ReadToEnd();
                }
            }
        }

        public static string ToCamelJson<T>(this T objectToSerialise)
        {
            return JsonConvert.SerializeObject(objectToSerialise, Formatting.Indented,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
                );
        }
    }
}