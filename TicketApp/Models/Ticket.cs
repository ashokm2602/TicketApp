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
        New, Assigned, InProgress, Resolved, Closed
    }
    public enum Tpriority { Low , Medium, High, Critical }

}