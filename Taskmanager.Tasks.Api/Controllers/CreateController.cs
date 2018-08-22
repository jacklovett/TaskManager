using System.Web.Http;
using Taskmanager.Repository;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;
using Taskmanager.Tasks.Api.ViewModels;

namespace Taskmanager.Tasks.Api.Controllers
{
    public class CreateController : ApiController
    {
        private readonly TaskDataContext _taskDataContext = new TaskDataContext("name=PublicDbContext");
        
        [HttpPost]
        public TaskEntityModel Task(CreateTaskModel model)
        {
            using (var repo = new TaskRepository(_taskDataContext))
            {
                var task = model.Map();
                // commit new task to db
                return repo.Create(task);
            }
        }
    }
}