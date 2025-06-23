using Resume_builder.Features.Users;

namespace Resume_builder.Features.Auth;

public class RegisterCommand
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}