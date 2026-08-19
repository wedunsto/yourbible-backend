using Microsoft.AspNetCore.Mvc;
using YourBible.Backend.Models;
using YourBible.Backend.Services;

namespace YourBible.Backend.Controllers;

// Controller used to handle requests to verify if a user account exists
[ApiController]
[Route("users")]
public class UserExistsController : ControllerBase {
	private readonly UserExistsService _userExistsService;
	
	public UserExistsController(UserExistsService userExistsService) {
		_userExistsService = userExistsService;
	}
	
	// GET route controller used to handle requests to verify if a user account exists
	[HttpGet("exists")]
	public async Task<ActionResult<UserExistsResponse>> Exists([FromQuery] string username) {
		try {
			var exists = await _userExistsService.UserExists(username);
			return Ok(new UserExistsResponse(exists));
		}
		// TODO: Make better exception handling
		catch (InvalidOperationException ex) {
			return Conflict(new { message = ex.Message });
		}
	}
}