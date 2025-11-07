using System.ComponentModel.DataAnnotations;

namespace TicketApp.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }
        [Required]
        public int TicketId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required,StringLength(500)]
        public string Message { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        
    }
}
