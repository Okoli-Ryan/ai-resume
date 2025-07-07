using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Resume_builder.Common;

namespace Resume_builder.Infrastructure.Services.TokenService;

public class TokenService : ITokenService
{
    private readonly AppSettings _appSettings;
    private readonly SymmetricSecurityKey _securityKey;

    public TokenService(IOptions<AppSettings> appSettings)
    {
        _appSettings = appSettings.Value;
        _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.Jwt.Secret));
    }

    public string Generate(string userId, string email, IList<string>? roles = null)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.Email, email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (roles != null) claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var credentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _appSettings.Jwt.Issuer,
            _appSettings.Jwt.Audience,
            claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}