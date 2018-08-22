using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Taskmanager.Repository.Entities;
using Taskmanager.Repository.DataContext;

namespace Taskmanager.Repository
{
    public class ProjectRepository : BaseRepository<ProjectDataContext>, IDisposable
    {
        /// <summary>
        /// Default constructor is private to prevent instantion without DbContext
        /// </summary>
        private ProjectRepository() : base(null)
        {
        }

        /// <summary>
        /// public constructor
        /// </summary>
        /// <param name="context"></param>
        public ProjectRepository(ProjectDataContext context) : base(context)
        {
            this.Context = context;
        }

        public IEnumerable<ProjectEntityModel> Get()
        {
            return Context.Projects.ToList();
        }

        public ProjectEntityModel Get(int projectId)
        {
            return Context.Projects.FirstOrDefault(x => x.ProjectId == projectId);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ProjectEntityModel Create(ProjectEntityModel model)
        {
            Context.Projects.Add(model);
            // todo - set up needed agent 
            Context.SaveChanges("System");

            return model;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ProjectEntityModel Update(ProjectEntityModel model)
        {
            Context.Configuration.AutoDetectChangesEnabled = true;

            var project = Get(model.ProjectId);

            project.Name = model.Name;
            project.Description = model.Description;
            project.IsActive = model.IsActive;
            
            project.ModifiedDate = DateTime.Now;

            Context.Entry(project).State = EntityState.Modified;
            // todo - set up needed agent 
            Context.SaveChanges("System");

            return project;
        }



    }
}