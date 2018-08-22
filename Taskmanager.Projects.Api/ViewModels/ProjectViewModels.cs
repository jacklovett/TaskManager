using System;
using System.ComponentModel.DataAnnotations;
using Taskmanager.Repository.Entities;

namespace Taskmanager.Projects.Api.ViewModels
{
    public abstract class ProjectViewModelBase
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }
    }

    /// <summary>
    /// Model definition for creating a product
    /// </summary>
    public class CreateProjectModel : ProjectViewModelBase
    {
        public ProjectEntityModel Map()
        {
            return new ProjectEntityModel()
            {
                Name = this.Name,
                Description = this.Description
            };
        }
    }

    /// <summary>
    /// Model definition for updating a product
    /// </summary>
    public class UpdateProjectModel : ProjectViewModelBase
    {
        [Required]
        public int ProjectId { get; set; }

        public bool IsActive { get; set; }

        public DateTime ModifiedDate => DateTime.Now;

        public ProjectEntityModel Map()
        {
            return new ProjectEntityModel()
            {
                ProjectId = this.ProjectId,
                Name = this.Name,
                Description = this.Description,
                IsActive = this.IsActive
            };
        }

        public class DeleteProject : ProjectViewModelBase
        {
            [Required]
            public int ProjectId { get; set; }

            public bool IsDeleted => true;
            
            public DateTime ModifiedDateTime => DateTime.Now;
        }
    }

}