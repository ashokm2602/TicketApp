using TicketApp.Models;
namespace TicketApp.Repositories
{
    public interface IUserRepository
    {
        public Task<List<User>> GetAllUsers();
        public Task<User> GetUserById(int userId);
        public Task<User> AddUser(User user);
        public Task<User> UpdateUser(User user);
        public Task DeleteUser(int userId);
        public Task<bool> Exists(int userId);
        public Task<List<User>> GetUsersByRole(UserRole role);
        public Task<User?> GetUserByEmail(string email);

    }
}
