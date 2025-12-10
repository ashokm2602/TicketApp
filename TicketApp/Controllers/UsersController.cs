using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketApp.Models;
using TicketApp.Repositories;
using static TicketApp.DTOs.UserDTO;

namespace TicketApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public static UserResponse ToUserResponse(User u)
        {
            UserResponse res = new UserResponse { UserId = u.UserId, Name = u.Name, Email = u.Email, Role = u.Role };
            return res;
        }

        [HttpGet]

        public async Task<ActionResult<IEnumerable<UserResponse>>> GetAllUsers()
        {
            var list = await _userRepository.GetAllUsers();
            var response = list.Select(ToUserResponse);
            return Ok(response);
        }

        [HttpGet("GetUserById{id:int}")]

        public async Task<ActionResult<UserResponse>> GetUserById(int id)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(ToUserResponse(user));
        }

        [HttpDelete("DeleteUser{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var exists = await _userRepository.Exists(id);
            if (!exists)
            {
                return NotFound();
            }
            await _userRepository.DeleteUser(id);
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<UserResponse>> AddUser(UserRequest user)
        {
            var newuser = new User { Name = user.Name, Email = user.Email, Role = user.Role, PasswordHash = user.PasswordHash };
            var addedUser = await _userRepository.AddUser(newuser);
            var response = ToUserResponse(addedUser);
            return CreatedAtAction(nameof(GetUserById), new { id = response.UserId }, response);
        }

        [HttpPut("UpdateUser{id:int}")]

        public async Task<ActionResult<UserResponse>> UpdateUser(int id, UserUpdate user)
        {
            var existingUser = await _userRepository.GetUserById(id);
            if (existingUser == null)
            {
                return NotFound();
            }
            existingUser.Name = user.Name;
            existingUser.Role = user.Role;
            existingUser.Email = user.Email;
            existingUser.PasswordHash = user.PasswordHash;
            existingUser.IsActive = user.IsActive;
            var updatedUser = await _userRepository.UpdateUser(existingUser);
            var response = ToUserResponse(updatedUser);
            return Ok(response);
        }

        [HttpGet("role/")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsersByRole(UserRole role)
        {
            var users = await _userRepository.GetUsersByRole(role);
            var response = users.Select(ToUserResponse);
            return Ok(response);
        }

        [HttpGet("email/")]
        public async Task<ActionResult<UserResponse>> GetUserByEmail(string email)
        {
            var user = await _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(ToUserResponse(user));
        }
    }
}
