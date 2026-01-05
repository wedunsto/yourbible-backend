namespace YourBible.Backend.Models;

// DTO to handle data returned when a user logs into an existing account
public class LoginResponse  {
    public string AccessToken { get; set; } = default!;
    public string account_status { get; set; } = "new"; // New, Valid, Admin, Guest
}