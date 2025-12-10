using System.ComponentModel.DataAnnotations;

namespace TicketApp.Models
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }
        [Required, StringLength(40)]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        public Tpriority Priority { get; set; } = Tpriority.Low;
        public Tstatus Status { get; set; } = Tstatus.New;

        public int CreatedBy { get; set; }
        public int? AssignedTo { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;


        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }

    public enum Tstatus
    {
        New = 1, Assigned = 2, InProgress = 3, Resolved = 3, Closed = 4
    }
    public enum Tpriority { Low = 1, Medium = 2, High = 3, Critical = 4 }

}