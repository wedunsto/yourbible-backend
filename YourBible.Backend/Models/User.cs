using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourBible.Backend.Models;

[Table("users")]
public class User
{
    // Default to null but will be assigned later
    [Key]
    [Required]
    public string username { get; set; } = default!;

    [Required]
    public string password { get; set; } = default!;

    [Required]
    public string user_status { get; set; } = "new";

    public DateTimeOffset created_at { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset updated_at { get; set; } = DateTimeOffset.UtcNow;
}