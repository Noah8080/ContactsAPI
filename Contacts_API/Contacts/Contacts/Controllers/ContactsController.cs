using Contacts.Data;
using Contacts.Models;
using Contacts.Models.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Contacts.Controllers
{
    // brackets hold the name of the controller
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactDbContext dbContext;

        public ContactsController(ContactDbContext dbContext) 
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllContacts()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // convert from dbContext collection into a list
            var contacts = await dbContext.Contacts.ToListAsync();
            return Ok(contacts);
        }

        [HttpPost] 
        public async Task<IActionResult> AddContact(AddContactRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var DomainModelContact = new Contact
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Favorite = request.Favorite
            };
            await dbContext.Contacts.AddAsync(DomainModelContact);
            await dbContext.SaveChangesAsync();
            return Ok(DomainModelContact);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteContact(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contact = await dbContext.Contacts.FindAsync(id);
            if (contact is not null)
            {
                dbContext.Contacts.Remove(contact);
                await dbContext.SaveChangesAsync();      
                return Ok();
            }
            // if the deleted contact is not found, return fitting response
            return NotFound();

        }

    }
}
