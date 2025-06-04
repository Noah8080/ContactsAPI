namespace Contacts.Models.Domain
{
    public class Contact
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        //email can be a string or null
        public string? Email { get; set; }
        public required string Phone {get; set;} 
        public bool Favorite { get; set;}
    }
}
