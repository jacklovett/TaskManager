using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;
using Taskmanager.Repository.DataTransferObjects;

namespace Taskmanager.Repository
{
    public class TaskRepository : BaseRepository<TaskDataContext>, IDisposable
    {
        /// <summary>
        /// Default constructor is private to prevent instantion without DbContext
        /// </summary>
        private TaskRepository() : base(null)
        {
        }

        /// <summary>
        /// public constructor
        /// </summary>
        /// <param name="context"></param>
        public TaskRepository(TaskDataContext context) : base(context)
        {
            this.Context = context;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountId"></param>
        /// <returns></returns>
        public IEnumerable<TaskResponse> GetTasks(int? accountId)
        {
            return Context.Database.SqlQuery<TaskResponse>("exec [Task].[uspGetTasks] @AccountId",
                new SqlParameter { ParameterName = "@AccountId", SqlDbType = SqlDbType.Int, Direction = ParameterDirection.Input, Value = accountId ?? (object)DBNull.Value }
                ).ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="taskId"></param>
        /// <returns></returns>
        public TaskEntityModel GetTask(int taskId)
        {
            return Context.Tasks.FirstOrDefault(x => x.TaskId == taskId);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public TaskEntityModel Create(TaskEntityModel model)
        {
            Context.Tasks.Add(model);
            // todo - set up needed agent 
            Context.SaveChanges("System");

            SetProjectActivity(model.ProjectId);
            return model;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public TaskEntityModel Update(TaskEntityModel model)
        {
            Context.Configuration.AutoDetectChangesEnabled = true;

            var task = GetTask(model.TaskId);

            task.AssigneeId = model.AssigneeId;
            task.Name = model.Name;
            task.Description = model.Description;
            task.Comments = model.Comments;
            task.Deadline = model.Deadline;
            task.InProgress = model.InProgress;
            task.IsTesting = model.IsTesting;
            task.IsCompleted = model.IsCompleted;
            task.IsBacklog = model.IsBacklog;
            task.CompletedDate = model.CompletedDate;

            task.ModifiedDate = DateTime.Now;

            Context.Entry(task).State = EntityState.Modified;
            // todo - set up needed agent 
            Context.SaveChanges("System");

            SetProjectActivity(task.ProjectId); 

            return task;
        }

        private void SetProjectActivity(int projectId)
        {
            ProjectDataContext projectDataContext = new ProjectDataContext("name=PublicDbContext");

            using (var repo = new ProjectRepository(projectDataContext))
            {
                var project = repo.Get(projectId);
                
                var activeTasks = Context.Tasks.Where(t => t.ProjectId == projectId && t.IsBacklog == false && t.IsDeleted == false);

                project.IsActive = activeTasks.Any();

                repo.Update(project);
            }
        }
    }
}