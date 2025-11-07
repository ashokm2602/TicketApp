namespace TicketApp.DTOs
{
    public class CommentDTO
    {
        public class CommentResponse
        {
            public int CommentId { get; set; }
            public int TicketId { get; set; }
            public int UserId { get; set; }
            public string Message { get; set; }
            public DateTime CreatedDate { get; set; }
        }
        public class CommentRequest
        {
            public int TicketId { get; set; }
            public int UserId { get; set; }
            public string Message { get; set; }
        }
    }
}
