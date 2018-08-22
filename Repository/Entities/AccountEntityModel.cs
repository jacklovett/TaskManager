namespace Taskmanager.Repository.Entities
{
    public class AccountEntityModel : AuditableEntityModel
    {
        public int AccountId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public bool IsDeleted { get; set; }
    }
}