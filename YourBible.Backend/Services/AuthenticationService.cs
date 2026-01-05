using Microsoft.EntityFrameworkCore;
using YourBible.Backend.Data;
using YourBible.Backend.Models; // Use the DTOs in the Models folder

namespace YourBible.Backend.Services;

// Business logic used to handle registration and login requests
public class AuthenticationService {
    // Gain access to CRUD data on the SQL database
    private readonly AppDbContext _db;

    public AuthenticationService(AppDbContext db) {
        _db = db;
    }

    // Business logic used to handle registration requests
    public async Task<RegistrationResponse> Register(AuthenticationRequest request)
    {
        // Enforce unique username
        var exists = await _db.Users.AnyAsync(u => u.username == request.Username);

        if (exists) throw new InvalidOperationException("Username already exists.");

        var password = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

        var registered = new RegistrationResponse {
            username = request.Username,
            account_status = "new",
        };

        var newUser = new User {
            username = request.Username,
            password = password,
            user_status = "new",
        };

        _db.Users.Add(newUser);
        await _db.SaveChangesAsync();

        return registered;
    }

    // Business logic used to handle login requests
    public async Task<LoginResponse> Login (AuthenticationRequest request) {
        var userData = await _db.Users.SingleOrDefaultAsync(u => u.username == request.Username);

        // TODO: throw the right exception if for some reason userData is null
        if (userData == null) throw new UnauthorizedAccessException("Invalid credentials.");

        var password = BCrypt.Net.BCrypt.Verify(request.Password, userData.password);

        if (!password) throw new UnauthorizedAccessException("Invalid credentials.");

        // Store when the username was logged in
        userData.updated_at = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();

        // TODO: Implement JWT for users to CRUD account specific data
        return new LoginResponse
        {
            AccessToken = "fake-token-123", // Stub JWT
            account_status = userData.user_status
        };
    }
}