using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TicketApp.Models;
using TicketApp.Repositories;

namespace TicketApp.Tests.Repositories
{
    public class CommentRepositoryTests
    {
        private AppDbContext _context;
        private CommentRepository _repository;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _repository = new CommentRepository(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        // ----------------------------------------------------
        // TEST: Add Comment
        // ----------------------------------------------------
        [Test]
        public async Task AddComment_ShouldAddSuccessfully()
        {
            var comment = new Comment
            {
                TicketId = 1,
                UserId = 2,
                Message = "Test comment",
                
                CreatedDate = DateTime.UtcNow
            };

            var result = await _repository.AddComment(comment);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Message, Is.EqualTo("Test comment"));
            Assert.That(await _context.Comments.CountAsync(), Is.EqualTo(1));
        }

        // ----------------------------------------------------
        // TEST: Delete Comment
        // ----------------------------------------------------
        [Test]
        public async Task DeleteComment_ShouldRemoveComment()
        {
            var comment = new Comment
            {
                TicketId = 1,
                UserId = 2,
                Message = "Delete me",
                CreatedDate = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            await _repository.DeleteComment(comment.CommentId);

            Assert.That(await _context.Comments.CountAsync(), Is.EqualTo(0));
        }

        [Test]
        public void DeleteComment_ShouldThrow_WhenNotFound()
        {
            Assert.ThrowsAsync<Exception>(async () =>
            {
                await _repository.DeleteComment(999);
            });
        }

        // ----------------------------------------------------
        // TEST: GetCommentById
        // ----------------------------------------------------
        [Test]
        public async Task GetCommentById_ShouldReturnCorrectComment()
        {
            var comment = new Comment
            {
                TicketId = 1,
                UserId = 3,
                Message = "Find me",
                CreatedDate = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var result = await _repository.GetCommentById(comment.CommentId);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Message, Is.EqualTo("Find me"));
        }

        // ----------------------------------------------------
        // TEST: GetAllCommentsByTicketId
        // ----------------------------------------------------
        [Test]
        public async Task GetAllCommentsByTicketId_ShouldReturnCorrectList()
        {
            _context.Comments.Add(new Comment { TicketId = 100, UserId = 1, Message = "C1", CreatedDate = DateTime.UtcNow });
            _context.Comments.Add(new Comment { TicketId = 100, UserId = 2, Message = "C2", CreatedDate = DateTime.UtcNow });
            _context.Comments.Add(new Comment { TicketId = 200, UserId = 3, Message = "C3", CreatedDate = DateTime.UtcNow });
            await _context.SaveChangesAsync();

            var result = await _repository.GetAllCommentsByTicketId(100);

            Assert.That(result.Count, Is.EqualTo(2));
        }

        // ----------------------------------------------------
        // TEST: Exists
        // ----------------------------------------------------
        [Test]
        public async Task Exists_ShouldReturnTrue_WhenCommentExists()
        {
            var comment = new Comment
            {
                TicketId = 1,
                UserId = 5,
                Message = "Exists?",
                CreatedDate = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var exists = await _repository.exists(comment.CommentId);

            Assert.That(exists, Is.True);
        }
    }
}
