using Microsoft.EntityFrameworkCore;
using TicketApp.Models;

namespace TicketApp.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> AddUser(User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                throw new Exception("A user with this email already exists.");
            }
            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DeleteUser(int userId)
        {
                       var existing = await _context.Users.FindAsync(userId);
            if (existing != null)
            {
                _context.Users.Remove(existing);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<bool> Exists(int userId) => await _context.Users.AnyAsync(u => u.UserId == userId);
       

        public Task<List<User>> GetAllUsers()
        {
            var list =  _context.Users.ToListAsync();
            return list;
        }

        public Task<User?> GetUserByEmail(string email)
        {
            var user = _context.Users.FirstOrDefaultAsync(u =>u.Email == email);
            return user;
        }

        public async Task<User> GetUserById(int userId) => await _context.Users.FindAsync(userId);


        public Task<List<User>> GetUsersByRole(UserRole role)
        {
            var list = _context.Users.Where(u => u.Role == role).ToListAsync();
            return list;
        }

       public async Task<User> UpdateUser(User user)
        {
            var existing = await _context.Users.FindAsync(user.UserId);
            if (existing == null)
            {
                throw new Exception("User not found");
            }
            existing.Name = user.Name;
            existing.Email = user.Email;
            existing.PasswordHash = user.PasswordHash;
            existing.Role = user.Role;
            existing.IsActive = user.IsActive;
            _context.Users.Update(existing);
            await _context.SaveChangesAsync();
            return existing;
        }
    }
}
