using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using Taskmanager.Repository;
using Taskmanager.Repository.DataContext;
using Taskmanager.Tasks.Api.ViewModels;
using Taskmanager.Common;
using Taskmanager.Common.JsonHelpers;

namespace Taskmanager.Tasks.Api.Controllers
{
    public class UpdateController : ApiController
    {
        private readonly TaskDataContext _taskDataContext = new TaskDataContext("name=PublicDbContext");

        [HttpPost]
        public HttpResponseMessage Task(UpdateTaskModel model)
        {
            using (var repo = new TaskRepository(_taskDataContext))
            {
                var task = repo.GetTask(model.TaskId);

                if (task == null) return Utils.Invalid("Unable to find task to update");

                task = model.Map();

                var response = new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(repo.Update(task).ToJson(), Encoding.UTF8, "application/json")
                };
                return response;
            }
        }
    }
}