namespace Resume_builder.Infrastructure.Services.TokenService;

public interface ITokenService
{
    string Generate(string userId, string email, IList<string>? roles);
}