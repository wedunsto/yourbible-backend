namespace YourBible.Backend.Models;

// DTO to handle users registering for new accounts and logging into existing accounts
public record AuthenticationRequest(string Username, string Password);