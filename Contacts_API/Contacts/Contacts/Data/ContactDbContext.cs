using Contacts.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Data
{
    public class ContactDbContext: DbContext
    {

        public ContactDbContext(DbContextOptions options) : base(options) 
        {

        }
        public DbSet<Contact> Contacts { get; set; }

    }
}
