using System.Security.Claims;

namespace Resume_builder.Infrastructure.Services.ClaimService;

public class ClaimsService(IHttpContextAccessor httpContextAccessor) : IClaimsService
{
    public string? GetUserId()
    {
        return httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}