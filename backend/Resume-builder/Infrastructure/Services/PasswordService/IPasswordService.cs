namespace Resume_builder.Infrastructure.Services.PasswordService;

public interface IPasswordService
{
    string Hash(string password);
    bool Verify(string hash, string password);
}