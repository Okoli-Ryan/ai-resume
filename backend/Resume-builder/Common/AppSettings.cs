namespace Resume_builder.Common;

public class AppSettings
{
    public JwtSettings? Jwt { get; set; } = new();
    public string? GoogleClientID { get; set; } = string.Empty;
    public string? OpenAIKey { get; set; } = string.Empty;
    public string? DbConnectionString { get; set; } = string.Empty;
    public string? UploadThingToken { get; set; } = string.Empty;
    public string? UploadThingApiKey { get; set; } = string.Empty;
    public string? UploadCarePublicKey { get; set; } = string.Empty;
    public string? UploadCareSecretKey { get; set; } = string.Empty;
    public string? ShortIoApiKey { get; set; } = string.Empty;
}

public class JwtSettings
{
    public string? Secret { get; set; } = string.Empty;
    public string? Audience { get; set; } = string.Empty;
    public string? Issuer { get; set; } = string.Empty;
    public int ExpiryMinutes { get; set; } = 3600;
}