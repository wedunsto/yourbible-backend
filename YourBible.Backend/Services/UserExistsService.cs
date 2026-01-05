using Microsoft.EntityFrameworkCore;
using YourBible.Backend.Data;

namespace YourBible.Backend.Services;

// Business logic used to handle requests to verify if an account exists
public class UserExistsService
{
    private readonly AppDbContext _db;

    public UserExistsService(AppDbContext db) {
        _db = db;
    }

    // Will true or false if the account exists
    public async Task<bool> UserExists(string username) {
        // TODO: Query database for username
        var exists = await _db.Users.AnyAsync(u => u.username == username);

        if (exists) return true;

        return false;
    }
}