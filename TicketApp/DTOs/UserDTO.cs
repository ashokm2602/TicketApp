using System.ComponentModel.DataAnnotations;
using TicketApp.Models;
namespace TicketApp.DTOs
{
    public class UserDTO
    {
        public class UserResponse
        {
            public int UserId { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public UserRole Role { get; set; } = UserRole.Customer;
            public bool isActive { get; set; }
        }
        public class UserRequest
        {
            [Required, StringLength(50)]
            public string Name { get; set; }
            [EmailAddress]
            public string Email { get; set; }
            [Required]
            public string PasswordHash { get; set; }
            public UserRole Role { get; set; } = UserRole.Customer;
        }

        public class UserUpdate
        {
            [Required, StringLength(50)]
            public string Name { get; set; }
            [EmailAddress]
            public string Email { get; set; }
            [Required]
            public string PasswordHash { get; set; }
            public UserRole Role { get; set; } = UserRole.Customer;
            public bool IsActive { get; set; } = true;
        }

    }
}
