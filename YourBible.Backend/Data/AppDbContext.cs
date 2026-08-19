using Microsoft.EntityFrameworkCore;
using YourBible.Backend.Models;

namespace YourBible.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // allows CRUD queries for the User data
    public DbSet<User> Users => Set<User>();

    // Configure the model from the entity types exposed in DbSet<User> properties
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var e = modelBuilder.Entity<User>();
        e.HasIndex(u => u.username).IsUnique();
        e.Property(u => u.user_status).HasConversion<string>();              // enum -> text
        e.Property(u => u.created_at).HasDefaultValueSql("NOW()");
        e.Property(u => u.updated_at).HasDefaultValueSql("NOW()");
    }
}