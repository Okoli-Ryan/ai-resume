using Resume_builder.Features.Users.Common;

namespace Resume_builder.Features.Auth.Common;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
}