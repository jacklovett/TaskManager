using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Taskmanager.Repository;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;
using Taskmanager.Repository.DataTransferObjects;
using Taskmanager.Tasks.Api.ViewModels;

namespace Taskmanager.Tasks.Api.Controllers
{
    public class GetController : ApiController
    {
        private readonly TaskDataContext _taskDataContext = new TaskDataContext("name=PublicDbContext");

        [HttpGet]
        public TaskEntityModel Task(int taskId)
        {
            using (var repo = new TaskRepository(_taskDataContext))
            {
                return repo.GetTask(taskId);
            }
        }

        [HttpPost]
        public IEnumerable<TaskResponse> Tasks(int? accountId)
        {
            using (var repo = new TaskRepository(_taskDataContext))
            {
                return repo.GetTasks(accountId).Where(t => t.IsBacklog == false);
            }
        }

        [HttpPost]
        public IEnumerable<TaskResponse> Backlog(int? accountId)
        {
            using (var repo = new TaskRepository(_taskDataContext))
            {
                return repo.GetTasks(accountId).Where(t => t.IsBacklog);
            }
        }
    }
}