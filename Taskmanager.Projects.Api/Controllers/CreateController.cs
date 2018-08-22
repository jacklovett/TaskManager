using System.Web.Http;
using Taskmanager.Repository;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;
using Taskmanager.Projects.Api.ViewModels;

namespace Taskmanager.Projects.Api.Controllers
{
    public class CreateController : ApiController
    {
        private readonly ProjectDataContext _projectDataContext = new ProjectDataContext("name=PublicDbContext");

        [HttpPost]
        public ProjectEntityModel Project(CreateProjectModel model)
        {
            using (var repo = new ProjectRepository(_projectDataContext))
            {
                var project = model.Map();
                // commit new project to db
                return repo.Create(project);
            }
        }

    }
}