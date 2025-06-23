using System.Security.Cryptography;
using System.Text;

namespace Resume_builder.Utils;

/// <summary>
///     Service for generating random strings
/// </summary>
public static class RandomStringGenerator
{
    private const string AllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    /// <summary>
    ///     Generates a random string of specified length
    /// </summary>
    /// <param name="length">The length of the random string to generate</param>
    /// <returns>A random string</returns>
    public static string Generate(int length)
    {
        if (length <= 0)
            throw new ArgumentException("Length must be greater than zero.", nameof(length));

        var randomBytes = new byte[length];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);

        var sb = new StringBuilder(length);

        for (var i = 0; i < length; i++)
        {
            // Map the byte to an allowed character
            var index = randomBytes[i] % AllowedChars.Length;
            sb.Append(AllowedChars[index]);
        }

        return sb.ToString();
    }
}