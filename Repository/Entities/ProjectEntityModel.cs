namespace Taskmanager.Repository.Entities
{
    public class ProjectEntityModel : AuditableEntityModel
    {
        public int ProjectId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}