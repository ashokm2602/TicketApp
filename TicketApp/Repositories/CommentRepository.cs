using Microsoft.EntityFrameworkCore;
using TicketApp.Models;
namespace TicketApp.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _context;
        public CommentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Comment> AddComment(Comment comment)
        {
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            return comment;

        }


        public async Task DeleteComment(int commentId)
        {
            var existing = await _context.Comments.FindAsync(commentId);
            if (existing == null)
            {
                throw new Exception("Comment not found");
            }
            _context.Comments.Remove(existing);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Comment>> GetAllCommentsByTicketId(int ticketId)
        {
            var list = await _context.Comments.Where(c => c.TicketId == ticketId).ToListAsync();
            return list;
        }

        public async Task<Comment?> GetCommentById(int commentId) => await _context.Comments.FindAsync(commentId);


        public async Task<bool> exists(int commentId) => await _context.Comments.AnyAsync(c => c.CommentId == commentId);

    }
}
