using System.ComponentModel.DataAnnotations;
using TicketApp.Models;

namespace TicketApp.DTOs
{
    public class TicketDTO
    {
        public class TicketResponse
        {
            public int TicketId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public Tpriority Priority { get; set; } = Tpriority.New;
            public Tstatus Status { get; set; } = Tstatus.Low;
            public int CreatedBy { get; set; }
            public int? AssignedTo { get; set; }
        }

        public class TicketRequest
        {
                       [Required, StringLength(40)]
            public string Title { get; set; }
            [Required]
            public string Description { get; set; }
            public Tpriority Priority { get; set; } = Tpriority.New;
            public Tstatus Status { get; set; } = Tstatus.Low;
            public int CreatedBy { get; set; }
            public int? AssignedTo { get; set; }
        }

        public class TicketUpdate
        {
            [Required, StringLength(40)]
            public string Title { get; set; }
            [Required]
            public string Description { get; set; }
            public Tpriority Priority { get; set; } = Tpriority.New;
            public Tstatus Status { get; set; } = Tstatus.Low;
            public int? AssignedTo { get; set; }
        }
    }
}
