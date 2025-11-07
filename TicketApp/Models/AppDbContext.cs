using Microsoft.EntityFrameworkCore;

namespace TicketApp.Models
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.UserId);
                entity.Property(u => u.Name).IsRequired().HasMaxLength(50);

                entity.Property(u => u.Email).IsRequired(false);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.HasMany(u => u.CreatedTickets).WithOne().HasForeignKey(t => t.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                entity.HasMany(u => u.AssignedTickets).WithOne().HasForeignKey(t => t.AssignedTo).OnDelete(DeleteBehavior.Restrict);
                entity.HasMany(u => u.Comments).WithOne().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.ToTable("Tickets");
                entity.HasKey(e => e.TicketId);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(40);
                entity.Property(e => e.Description).IsRequired();
                entity.HasMany(t => t.Comments).WithOne().HasForeignKey(c => c.TicketId).OnDelete(DeleteBehavior.Cascade);


            });
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("Comments");
                entity.HasKey(e => e.CommentId);
                entity.Property(e => e.Message).IsRequired();
                entity.Property(e => e.TicketId).IsRequired();
                entity.Property(e => e.UserId).IsRequired();    


            });
        }
    }
}
