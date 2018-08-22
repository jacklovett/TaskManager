using System.Collections.Generic;
using System.Web.Http;
using Taskmanager.Repository;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;

namespace Taskmanager.Projects.Api.Controllers
{
    public class GetController : ApiController
    {
        private readonly ProjectDataContext _projectDataContext = new ProjectDataContext("name=PublicDbContext");

        [HttpGet]
        public ProjectEntityModel Project(int projectId)
        {
            using (var repo = new ProjectRepository(_projectDataContext))
            {
                return repo.Get(projectId);
            }
        }

        [HttpGet]
        public IEnumerable<ProjectEntityModel> Projects()
        {
            using (var repo = new ProjectRepository(_projectDataContext))
            {
                return repo.Get();
            }
        }

    }
}