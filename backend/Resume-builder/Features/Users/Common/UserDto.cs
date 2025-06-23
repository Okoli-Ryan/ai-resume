using Resume_builder.Common;

namespace Resume_builder.Features.Users.Common;

public class UserDto : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}