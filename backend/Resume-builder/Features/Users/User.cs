using Resume_builder.Common;
using Resume_builder.Features.Users.Common;

namespace Resume_builder.Features.Users;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string? GoogleId { get; set; }
}

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Email = user.Email,
            Name = user.Name,
            ActiveStatus = user.ActiveStatus,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Id = user.Id
        };
    }
}