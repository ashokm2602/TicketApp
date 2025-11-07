using Microsoft.EntityFrameworkCore;
using TicketApp.Models;
namespace TicketApp.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly AppDbContext _context;
        public TicketRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Ticket> AddTicket(Ticket ticket)
        {
            await _context.Tickets.AddAsync(ticket);
            return ticket;
        }
       

        public async Task DeleteTicket(int ticketId)
        {
            var exiting = await _context.Tickets.FindAsync(ticketId);
            _context.Tickets.Remove(exiting);
        }

        public async Task<bool> Exists(int ticketId) => await _context.Tickets.AnyAsync(t => t.TicketId == ticketId);
       

        public async Task<List<Ticket>> GetAllTickets()=>await _context.Tickets.ToListAsync();


        public async Task<Ticket?> GetTicketById(int ticketId) => await _context.Tickets.FindAsync(ticketId);


        public async Task<List<Ticket>> GetTicketsByAgent(int AssignedTo) => await  _context.Tickets.Where(t => t.AssignedTo == AssignedTo).ToListAsync();


        public async Task<List<Ticket>> GetTicketsByClient(int CreatedBy) => await _context.Tickets.Where(t => t.CreatedBy == CreatedBy).ToListAsync();
       

        public async Task<Ticket> UpdateTicket(Ticket ticket)
        {
           var existing = await _context.Tickets.FindAsync(ticket.TicketId); 
              if(existing == null)
              {
                 throw new Exception("Ticket not found");
            }
              
            existing.Title = ticket.Title;
            existing.Description = ticket.Description;
            existing.Status = ticket.Status;
            existing.Priority = ticket.Priority;
            existing.AssignedTo = ticket.AssignedTo;
          
            _context.Tickets.Update(existing);
            await _context.SaveChangesAsync();
            return existing;
        }
    }
}
