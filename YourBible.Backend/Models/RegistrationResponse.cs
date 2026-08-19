namespace YourBible.Backend.Models;

// DTO to handle data returned when a user creates a new account
public class RegistrationResponse {
    public string username { get; set; } = default!;
    public string account_status { get; set; } = "new"; // New, Valid, Admin, Guest
}