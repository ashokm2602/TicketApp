using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketApp.Repositories;
using TicketApp.Models;
using TicketApp.DTOs;
using static TicketApp.DTOs.TicketDTO;
using Microsoft.AspNetCore.Authorization;

namespace TicketApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketRepository _ticket;
        public TicketsController(ITicketRepository ticket)
        {
            _ticket = ticket;
        }

        private static TicketResponse ToTicketResponse(Ticket t)
        {
            TicketResponse res = new TicketResponse { AssignedTo = t.AssignedTo, CreatedBy = t.CreatedBy, Description = t.Description, Priority = t.Priority, Status = t.Status, TicketId = t.TicketId, Title = t.Title };
            return res;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetAllTickets()
        {
            var tickets = await _ticket.GetAllTickets();
            var Response = tickets.Select(ToTicketResponse);
            return Ok(Response);
        }

        [HttpGet("{id:int}")]

        public async Task<ActionResult<TicketResponse>> GetTicketById(int id)
        {
            var ticket = await _ticket.GetTicketById(id);
                        if (ticket == null)
            {
                return NotFound();
            }
            return Ok(ToTicketResponse(ticket));
        }

        [HttpGet("client/{CreatedBy:int}")]
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetTicketsByClient(int createdby)
        {
            var tickets = await _ticket.GetTicketsByClient(createdby);
            var response = tickets.Select(ToTicketResponse);
            return Ok(response);
        }
        [HttpGet("agent/{AssignedTo:int}")]
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetTicketsByAgent(int assignedto)
        {
            var tickets = await _ticket.GetTicketsByAgent(assignedto);
            var response = tickets.Select(ToTicketResponse);
            return Ok(response);
        }


        [HttpPost("createticket")]
        public async Task<ActionResult<TicketResponse>> CreateTicket([FromBody]TicketRequest ticket)
        {
            var newTicket = new Ticket
            {
                Title = ticket.Title,
                Description = ticket.Description,
                Priority = ticket.Priority,
                Status = ticket.Status,
                CreatedBy = ticket.CreatedBy,
                AssignedTo = ticket.AssignedTo
            };
            var createdTicket = await _ticket.AddTicket(newTicket);
            var response = ToTicketResponse(createdTicket);
            return CreatedAtAction(nameof(GetTicketById),new {id = response.TicketId }, response);  
        }

        [HttpPut("{id:int}")]

        public async Task<ActionResult<TicketResponse>> UpdateTicket(int id, [FromBody]TicketUpdate ticketUpdate)
        {
            var existing = await _ticket.GetTicketById(id);
            if ((existing==null))
            {
                return NotFound();
            }
            existing.Title = ticketUpdate.Title;
            existing.Description = ticketUpdate.Description;
            existing.Priority = ticketUpdate.Priority;
            existing.Status = ticketUpdate.Status;
            existing.AssignedTo = ticketUpdate.AssignedTo;
            var updatedTicket = await _ticket.UpdateTicket(existing);
            return Ok(ToTicketResponse(updatedTicket));

        }
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteTicket(int id)
        {
                       var existing = await _ticket.GetTicketById(id);
            if (existing == null)
            {
                return NotFound();
            }
            await _ticket.DeleteTicket(id);
            return NoContent();
        }


    }
}
