using Microsoft.AspNetCore.Identity;

namespace Resume_builder.Infrastructure.Services.PasswordService;


public class PasswordService : IPasswordService
{
    private readonly PasswordHasher<object> _hasher = new();

    public string Hash(string password) =>
        _hasher.HashPassword(null, password);

    public bool Verify(string hash, string password) =>
        _hasher.VerifyHashedPassword(null, hash, password)
        == PasswordVerificationResult.Success;
}