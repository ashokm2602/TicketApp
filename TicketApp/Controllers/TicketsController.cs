using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketApp.Models;
using TicketApp.Repositories;
using static TicketApp.DTOs.TicketDTO;

namespace TicketApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepo;

        public TicketsController(ITicketRepository ticketRepo)
        {
            _ticketRepo = ticketRepo;
        }

        // ---------------------------
        //   MAP ENTITY → DTO
        // ---------------------------
        private static TicketResponse ToTicketResponse(Ticket t)
        {
            return new TicketResponse
            {
                TicketId = t.TicketId,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority.ToString(),
                Status = t.Status.ToString(),
                CreatedBy = t.CreatedBy,
                AssignedTo = t.AssignedTo
            };
        }

        // ---------------------------
        //   GET ALL
        // ---------------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetAllTickets()
        {
            var tickets = await _ticketRepo.GetAllTickets();
            return Ok(tickets.Select(ToTicketResponse));
        }

        // ---------------------------
        //   PATCH: ASSIGN AGENT
        // ---------------------------
        [HttpPatch("{id}/assign")]
        public async Task<IActionResult> AssignAgent(int id, [FromBody] AssignAgentDto dto)
        {
            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null) return NotFound("Ticket not found");

            ticket.AssignedTo = dto.AgentId;
            ticket.Status = Tstatus.Assigned;

            var updated = await _ticketRepo.UpdateTicket(ticket);

            return Ok(ToTicketResponse(updated));
        }

        // ---------------------------
        //   PATCH: UPDATE STATUS ONLY
        // ---------------------------
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTicketStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            
            ticket.Status = dto.Status;

            await _ticketRepo.UpdateTicket(ticket);

            return Ok(ticket);
        }


        // ---------------------------
        //   GET BY ID
        // ---------------------------
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TicketResponse>> GetTicketById(int id)
        {
            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null) return NotFound();

            return Ok(ToTicketResponse(ticket));
        }

        // ---------------------------
        //   GET BY CLIENT
        // ---------------------------
        [HttpGet("client/{createdBy:int}")]
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetTicketsByClient(int createdBy)
        {
            var tickets = await _ticketRepo.GetTicketsByClient(createdBy);
            return Ok(tickets.Select(ToTicketResponse));
        }

        // ---------------------------
        //   GET BY AGENT
        // ---------------------------
        [HttpGet("agent/{assignedTo:int}")]
        public async Task<ActionResult<IEnumerable<TicketResponse>>> GetTicketsByAgent(int assignedTo)
        {
            var tickets = await _ticketRepo.GetTicketsByAgent(assignedTo);
            return Ok(tickets.Select(ToTicketResponse));
        }

        // ---------------------------
        //   CREATE TICKET
        // ---------------------------
        [HttpPost("createticket")]
        public async Task<ActionResult<TicketResponse>> CreateTicket([FromBody] TicketRequest req)
        {
            var newTicket = new Ticket
            {
                Title = req.Title,
                Description = req.Description,
                Priority = req.Priority,
                Status = req.Status,
                CreatedBy = req.CreatedBy,
                AssignedTo = req.AssignedTo
            };

            var created = await _ticketRepo.AddTicket(newTicket);

            return CreatedAtAction(nameof(GetTicketById),
                new { id = created.TicketId },
                ToTicketResponse(created));
        }

        // ---------------------------
        //   PUT: FULL UPDATE
        // ---------------------------
        [HttpPut("{id:int}")]
        public async Task<ActionResult<TicketResponse>> UpdateTicket(int id, [FromBody] TicketUpdate update)
        {
            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null) return NotFound();

            ticket.Title = update.Title;
            ticket.Description = update.Description;
            ticket.Priority = update.Priority;
            ticket.Status = update.Status;
            ticket.AssignedTo = update.AssignedTo;

            var updated = await _ticketRepo.UpdateTicket(ticket);

            return Ok(ToTicketResponse(updated));
        }

        // ---------------------------
        //   DELETE
        // ---------------------------
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null) return NotFound();

            await _ticketRepo.DeleteTicket(id);
            return NoContent();
        }
    }
}
