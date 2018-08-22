using System;
using System.ComponentModel.DataAnnotations;
using Taskmanager.Repository.Entities;

namespace Taskmanager.Tasks.Api.ViewModels
{
    public abstract class TaskViewModelBase
    {
        [Required]
        public int ProjectId { get; set; }

        public int? AssigneeId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string Comments { get; set; }

        public DateTime? Deadline { get; set; }
        
    }

    /// <summary>
    /// Model definition for creating a task
    /// </summary>
    public class CreateTaskModel : TaskViewModelBase
    {
        public TaskEntityModel Map()
        {
            return new TaskEntityModel()
            {
                ProjectId = this.ProjectId,
                AssigneeId = this.AssigneeId,
                Name = this.Name,
                Description = this.Description,
                Comments = this.Comments,
                Deadline = this.Deadline
            };
        }
    }

    /// <summary>
    /// Model definition for updating a task
    /// </summary>
    public class UpdateTaskModel : TaskViewModelBase
    {
        [Required]
        public int TaskId { get; set; }
        public bool InProgress { get; set; }
        public bool IsTesting { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsBacklog { get; set; }

        public DateTime ModifiedDate => DateTime.Now;

        public TaskEntityModel Map()
        {
            return new TaskEntityModel()
            {
                TaskId = this.TaskId,
                ProjectId = this.ProjectId,
                AssigneeId = this.AssigneeId,
                Name = this.Name,
                Description = this.Description,
                Comments = this.Comments,
                Deadline = this.Deadline,
                InProgress = this.InProgress,
                IsTesting = this.IsTesting,
                IsCompleted = this.IsCompleted,
                IsBacklog = this.IsBacklog
            };
        }
    }

    public class DeleteTask : TaskViewModelBase
    {
        [Required]
        public int TaskId { get; set; }

        public bool IsDeleted => true;

        public DateTime ModifiedDateTime => DateTime.Now;
    }
    
}