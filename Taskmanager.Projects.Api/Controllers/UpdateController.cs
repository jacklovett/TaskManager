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
using Taskmanager.Common;
using Taskmanager.Common.JsonHelpers;
using Taskmanager.Projects.Api.ViewModels;

namespace Taskmanager.Projects.Api.Controllers
{
    public class UpdateController : ApiController
    {
        private readonly ProjectDataContext _projectDataContext = new ProjectDataContext("name=PublicDbContext");

        [HttpPost]
        public HttpResponseMessage Project(UpdateProjectModel model)
        {
            using (var repo = new ProjectRepository(_projectDataContext))
            {
                var project = repo.Get(model.ProjectId);

                if (project == null) return Utils.Invalid("Unable to find account to update");

                project = model.Map();

                var response = new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(repo.Update(project).ToJson(), Encoding.UTF8, "application/json")
                };
                return response;
            }
        }
    }
}