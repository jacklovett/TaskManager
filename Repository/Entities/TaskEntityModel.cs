using System;

namespace Taskmanager.Repository.Entities
{
    public class TaskEntityModel : AuditableEntityModel
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public int? AssigneeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Comments { get; set; }
        public DateTime? Deadline { get; set; }
        public bool InProgress { get; set; }
        public bool IsTesting { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsBacklog { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? CompletedDate { get; set; }
    }
}