using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TicketApp.Models;
using TicketApp.Repositories;

namespace TicketApp.Tests.Repositories
{
    public class TicketRepositoryTests
    {
        private AppDbContext _context;
        private TicketRepository _repository;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _repository = new TicketRepository(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context?.Dispose();
        }

        // ----------------------------------------------------
        // TEST: Add Ticket
        // ----------------------------------------------------
        [Test]
        public async Task AddTicket_ShouldAddTicket()
        {
            var ticket = new Ticket
            {
                Title = "Issue",
                Description = "Test desc",
                Priority = Tpriority.New,
                Status = Tstatus.Critical,
                CreatedBy = 1,
                AssignedTo = 2
            };

            var result = await _repository.AddTicket(ticket);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Title, Is.EqualTo("Issue"));
            Assert.That(await _context.Tickets.CountAsync(), Is.EqualTo(1));
        }

        // ----------------------------------------------------
        // TEST: Delete Ticket
        // ----------------------------------------------------
        [Test]
        public async Task DeleteTicket_ShouldRemoveTicket()
        {
            var ticket = new Ticket
            {
                Title = "DeleteMe",
                Description = "Remove",
                Priority = Tpriority.Closed,
                Status = Tstatus.Critical,
                CreatedBy = 1,
                AssignedTo = 2
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            await _repository.DeleteTicket(ticket.TicketId);

            // IMPORTANT: Repo does NOT save changes, so we must do it here
            await _context.SaveChangesAsync();

            Assert.That(await _context.Tickets.CountAsync(), Is.EqualTo(0));
        }

        // ----------------------------------------------------
        // TEST: Exists
        // ----------------------------------------------------
        [Test]
        public async Task Exists_ShouldReturnTrue_WhenTicketExists()
        {
            var ticket = new Ticket
            {
                Title = "Exists",
                Description = "desc",
                Priority = Tpriority.Closed,
                Status = Tstatus.Medium,
                CreatedBy = 1,
                AssignedTo = 1
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            var result = await _repository.Exists(ticket.TicketId);

            Assert.That(result, Is.True);
        }

        // ----------------------------------------------------
        // TEST: Get All Tickets
        // ----------------------------------------------------
       

        // ----------------------------------------------------
        // TEST: Get Ticket By Id
        // ----------------------------------------------------
        [Test]
        public async Task GetTicketById_ShouldReturnCorrectTicket()
        {
            var ticket = new Ticket
            {
                Title = "FindMe",
                Description = "desc",
                Priority = Tpriority.New,
                Status = Tstatus.Critical,
                CreatedBy = 1
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            var result = await _repository.GetTicketById(ticket.TicketId);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Title, Is.EqualTo("FindMe"));
        }

        // ----------------------------------------------------
        // TEST: Get Tickets by Agent
        // ----------------------------------------------------
      

        // ----------------------------------------------------
        // TEST: Get Tickets by Client
        // ----------------------------------------------------
      

        // ----------------------------------------------------
        // TEST: Update Ticket
        // ----------------------------------------------------
       
    }
}
