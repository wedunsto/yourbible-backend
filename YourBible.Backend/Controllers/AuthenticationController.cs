using Microsoft.AspNetCore.Mvc;
using YourBible.Backend.Models;
using YourBible.Backend.Services;

namespace YourBible.Auth.Api.Controllers;

// Controller used to handle requests to create new accounts
// and requests to log into existing accounts
[ApiController]
[Route("users")]
public class AuthenticationController : ControllerBase {
    private readonly AuthenticationService _authService;
    
    public AuthenticationController(AuthenticationService authService) {
        _authService = authService;
    }

    // POST route controller used to handle requests to create new accounts
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthenticationRequest request) {
        try {
            var newUser = await _authService.Register(request);
            return Created("", newUser); // 201 for successful account creation
        }
        catch (InvalidOperationException ex) {
            return Conflict(new { message = ex.Message }); // 409 for duplicate username
        }
        catch (ArgumentException ex) {
            return BadRequest(new { message = ex.Message }); // 400 for validation
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An unexpected error occurred." });
        }
    }

    // POST route controller used to handle requests to log into existing accounts
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthenticationRequest request) {
        try {
            var existingUser = await _authService.Login(request);
            return Ok(existingUser);
        }
        catch (UnauthorizedAccessException) {
            return Unauthorized(new { message = "Invalid credentials." });
        }
    }
}