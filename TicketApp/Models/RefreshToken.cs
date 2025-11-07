using System.ComponentModel.DataAnnotations;

namespace TicketApp.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }

        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ✅ Foreign key to user
        public int UserId { get; set; }

        public User User { get; set; }
    }

}
