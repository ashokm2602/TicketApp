using TicketApp.Models;
namespace TicketApp.Repositories
{
    public interface ITicketRepository
    {
        public Task<List<Ticket>> GetAllTickets();
        public Task<Ticket?> GetTicketById(int ticketId);
        public Task<List<Ticket>> GetTicketsByClient(int CreatedBy);
        public Task<List<Ticket>> GetTicketsByAgent(int AssignedTo);
        public Task<Ticket> AddTicket(Ticket ticket);
        public Task<Ticket> UpdateTicket(Ticket ticket);
        public Task DeleteTicket(int ticketId);
        public Task<bool> Exists(int ticketId);
    }
}
