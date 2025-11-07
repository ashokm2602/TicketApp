using TicketApp.Models;
namespace TicketApp.Repositories
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetAllCommentsByTicketId(int ticketId);
        Task<Comment?> GetCommentById(int commentId);
        Task<Comment> AddComment(Comment comment);
        Task DeleteComment(int commentId);
        Task<bool> exists(int commentId);

    }
}
