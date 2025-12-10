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
            await _context.SaveChangesAsync();
            return ticket;
        }

        public async Task DeleteTicket(int ticketId)
        {
            var existing = await _context.Tickets.FindAsync(ticketId);
            if (existing == null) return;

            _context.Tickets.Remove(existing);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> Exists(int ticketId) =>
            await _context.Tickets.AnyAsync(t => t.TicketId == ticketId);

        public async Task<List<Ticket>> GetAllTickets() =>
            await _context.Tickets.AsNoTracking().ToListAsync();

        public async Task<Ticket?> GetTicketById(int ticketId) =>
            await _context.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.TicketId == ticketId);

        public async Task<List<Ticket>> GetTicketsByAgent(int assignedTo) =>
            await _context.Tickets
                .Where(t => t.AssignedTo == assignedTo)
                .AsNoTracking()
                .ToListAsync();

        public async Task<List<Ticket>> GetTicketsByClient(int createdBy) =>
            await _context.Tickets
                .Where(t => t.CreatedBy == createdBy)
                .AsNoTracking()
                .ToListAsync();

        public async Task<Ticket> UpdateTicket(Ticket ticket)
        {
            _context.Tickets.Update(ticket);
            await _context.SaveChangesAsync();
            return ticket;
        }
    }
}
