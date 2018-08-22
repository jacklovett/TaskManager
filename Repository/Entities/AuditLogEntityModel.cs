namespace Taskmanager.Repository.Entities
{
    public class AuditLogEntityModel : AuditableEntityModel
    {
        public int LogId { get; set; }
        public string EventType { get; set; }
        public string TableName { get; set; }
        public string ColumnName { get; set; }
        public string OriginalValue { get; set; }
        public string NewValue { get; set; }
    }
}