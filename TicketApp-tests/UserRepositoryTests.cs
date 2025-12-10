using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TicketApp.Models;
using TicketApp.Repositories;

namespace TicketApp.Tests.Repositories
{
    public class UserRepositoryTests
    {
        private AppDbContext _context;
        private UserRepository _repository;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _repository = new UserRepository(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context?.Dispose();
        }

        // -----------------------------------------------------------
        // TEST: Add User
        // -----------------------------------------------------------
        [Test]
        public async Task AddUser_ShouldAddUser_WhenEmailDoesNotExist()
        {
            var user = new User
            {
                Name = "Ashok",
                Email = "ashok@test.com",
                PasswordHash = "pass",
                Role = UserRole.Admin,
                IsActive = true
            };

            var result = await _repository.AddUser(user);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Email, Is.EqualTo("ashok@test.com"));
        }

        // -----------------------------------------------------------
        // TEST: Duplicate Email Throws Exception
        // -----------------------------------------------------------
        [Test]
        public void AddUser_ShouldThrowException_WhenEmailExists()
        {
            var user = new User
            {
                Name = "Test",
                Email = "test@test.com",
                PasswordHash = "pw",
                Role = UserRole.Admin,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var duplicate = new User
            {
                Name = "New",
                Email = "test@test.com",
                PasswordHash = "pw",
                Role = UserRole.Admin,
                IsActive = true
            };

            Assert.ThrowsAsync<Exception>(async () =>
                await _repository.AddUser(duplicate));
        }

        // -----------------------------------------------------------
        // TEST: Get User by ID
        // -----------------------------------------------------------
        [Test]
        public async Task GetUserById_ShouldReturnUser()
        {
            var user = new User
            {
                Name = "User",
                Email = "user@test.com",
                PasswordHash = "pw",
                Role = UserRole.Admin,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var result = await _repository.GetUserById(user.UserId);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Email, Is.EqualTo(user.Email));
        }

        // -----------------------------------------------------------
        // TEST: Delete User
        // -----------------------------------------------------------
        [Test]
        public async Task DeleteUser_ShouldRemoveUser()
        {
            var user = new User
            {
                Name = "Delete",
                Email = "delete@test.com",
                PasswordHash = "pw",
                Role = UserRole.Admin,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            await _repository.DeleteUser(user.UserId);

            var count = await _context.Users.CountAsync();
            Assert.That(count, Is.EqualTo(0));
        }

        // -----------------------------------------------------------
        // TEST: Exists
        // -----------------------------------------------------------
        [Test]
        public async Task Exists_ShouldReturnTrue_WhenUserExists()
        {
            var user = new User
            {
                Name = "Check",
                Email = "check@test.com",
                PasswordHash = "pw",
                Role = UserRole.Admin,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var result = await _repository.Exists(user.UserId);

            Assert.That(result, Is.True);
        }

        // -----------------------------------------------------------
        // TEST: Get by Email
        // -----------------------------------------------------------
        [Test]
        public async Task GetUserByEmail_ShouldReturnUser()
        {
            var user = new User
            {
                Name = "Email",
                Email = "email@test.com",
                PasswordHash = "pw",
                Role = UserRole.Admin,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var result = await _repository.GetUserByEmail("email@test.com");

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Email, Is.EqualTo("email@test.com"));
        }

        // -----------------------------------------------------------
        // TEST: Update User
        // -----------------------------------------------------------
        [Test]
        public async Task UpdateUser_ShouldUpdateFields()
        {
            var user = new User
            {
                Name = "Old",
                Email = "old@test.com",
                PasswordHash = "pw",
                Role = UserRole.Admin,
                IsActive = true
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            user.Name = "Updated";
            user.Email = "updated@test.com";

            var result = await _repository.UpdateUser(user);

            Assert.That(result.Name, Is.EqualTo("Updated"));
            Assert.That(result.Email, Is.EqualTo("updated@test.com"));
        }
    }
}
