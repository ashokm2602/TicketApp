using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TicketApp.Authentication;
using TicketApp.Models;     // your User model

namespace TicketApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthenticationController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // ✅ REGISTER
        [HttpPost("register")]
        public IActionResult Register(RegisterModel model)
        {
            // Check if email already exists
            var existing = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (existing != null)
                return BadRequest("User already exists");

            // Hash password
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new User
            {
                Name = model.Username,
                Email = model.Email,
                PasswordHash = hashedPassword,
                Role = model.Role,       // Admin, SupportAgent, Customer
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User Registered Successfully");
        }

        // ✅ LOGIN
        [HttpPost("login")]
        public IActionResult Login(LoginModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Name == model.Username);

            if (user == null)
                return Unauthorized("User not found");

            if (!BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                return Unauthorized("Invalid password");

            // ✅ Generate JWT token
            string token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            refreshToken.UserId = user.UserId;

            _context.RefreshTokens.Add(refreshToken);
            _context.SaveChanges();

            return Ok(new
            {
                Token = token,
                RefreshToken = refreshToken.Token,
                UserId = user.UserId,
                Role = user.Role.ToString()
            });

            

        }

        [HttpPost("refresh")]
        public IActionResult RefreshToken(RefreshRequest request)
        {
            var storedToken = _context.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefault(r => r.Token == request.RefreshToken);

            if (storedToken == null)
                return Unauthorized("Invalid refresh token");

            if (storedToken.IsRevoked)
                return Unauthorized("Token expired or revoked");

            // ✅ Generate new JWT
            string newJwt = GenerateJwtToken(storedToken.User);

            // ✅ Generate new refresh token (optional but recommended)
            var newRefresh = GenerateRefreshToken();
            newRefresh.UserId = storedToken.UserId;

            // ✅ Revoke old refresh token
            storedToken.Expires = DateTime.UtcNow;

            // ✅ Save new one
            _context.RefreshTokens.Add(newRefresh);
            _context.SaveChanges();

            return Ok(new
            {
                Token = newJwt,
                RefreshToken = newRefresh.Token
            });
        }


        // ✅ JWT Generator
        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("UserId", user.UserId.ToString()),
                new Claim("Name", user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:ValidIssuer"],
                audience: _config["Jwt:ValidAudience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("logout")]
        public IActionResult Logout(RefreshRequest request)
        {
            var token = _context.RefreshTokens.FirstOrDefault(t => t.Token == request.RefreshToken);
            if (token == null) return NotFound();

            token.Expires = DateTime.UtcNow;
            _context.SaveChanges();

            return Ok("Logged out successfully");
        }

        private RefreshToken GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            return new RefreshToken
            {
                Token = Convert.ToBase64String(randomBytes),
                Expires = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow
            };
        }

    }
}
