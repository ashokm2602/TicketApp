using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketApp.Models;
using TicketApp.Repositories;
using static TicketApp.DTOs.CommentDTO;

namespace TicketApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        public CommentsController(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }
        public static CommentResponse ToCommentResponse(Comment c)
        {
            CommentResponse res = new CommentResponse { CommentId = c.CommentId, TicketId = c.TicketId, Message = c.Message, CreatedDate = c.CreatedDate };
            return res;
        }

        [HttpGet("ticket/{ticketId:int}")]
        public async Task<ActionResult<IEnumerable<CommentResponse>>> GetAllCommentsByTicketId(int ticketId)
        {
            var comments = await _commentRepository.GetAllCommentsByTicketId(ticketId);
            var response = comments.Select(ToCommentResponse);
            return Ok(response);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CommentResponse>> GetCommentById(int id)
        {
            var comment = await _commentRepository.GetCommentById(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(ToCommentResponse(comment));
        }

        [HttpPost]
        public async Task<ActionResult<CommentResponse>> AddComment(CommentRequest commentRequest)
        {
            var newComment = new Comment
            {
                TicketId = commentRequest.TicketId,
                Message = commentRequest.Message,
                UserId = commentRequest.UserId
            };
            var addedComment = await _commentRepository.AddComment(newComment);
            return CreatedAtAction(nameof(GetCommentById), new { id = addedComment.CommentId }, ToCommentResponse(addedComment));
        }
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var exists = await _commentRepository.exists(id);
            if (!exists)
            {
                return NotFound();
            }
            await _commentRepository.DeleteComment(id);
            return NoContent();
        }
    }
}
