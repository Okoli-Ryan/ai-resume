using System.Text;
using Carter;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Infrastructure.Services.PasswordService;
using Resume_builder.Infrastructure.Services.TokenService;

namespace Resume_builder.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services
            .AddConfig(config)
            .AddPersistence()
            .AddServices()
            .AddAuth(config)
            .AddHttpContextAccessor()
            .AddValidatorsFromAssembly(typeof(Program).Assembly)
            .AddSwaggerGen()
            .AddCarter()
            .AddOpenApi();
    }

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IClaimsService, ClaimsService>();

        return services;
    }

    private static IServiceCollection AddConfig(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<AppSettings>(config.GetSection("AppSettings"));

        services.AddSwaggerGen();

        return services;
    }

    private static IServiceCollection AddPersistence(this IServiceCollection services)
    {
        services.AddDbContext<AppDbContext>(options => { options.UseInMemoryDatabase("LocalTestDb"); });

        return services;
    }

    private static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration config)
    {
        var appSettings = config
            .GetSection("AppSettings")
            .Get<AppSettings>()!;


        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = appSettings.Jwt.Issuer,
                    ValidAudience = appSettings.Jwt.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.Jwt.Secret))
                };
            });

        services.AddAuthorization();

        return services;
    }
}