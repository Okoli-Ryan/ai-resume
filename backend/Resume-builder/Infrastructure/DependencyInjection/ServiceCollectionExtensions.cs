using System.Text;
using Carter;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.IdentityModel.Tokens;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.Ollama;
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
            .AddHttpClient()
            .AddAIChatClient()
            .AddOpenApi();
    }


    private static IServiceCollection AddAIChatClient(this IServiceCollection services)
    {
        services.AddChatClient(sp =>
        {
            var httpClient = sp.GetRequiredService<IHttpClientFactory>()
                .CreateClient(nameof(OllamaChatClient));

            httpClient.BaseAddress = new Uri("http://localhost:9000");
            httpClient.Timeout = TimeSpan.FromMinutes(5);

            return new OllamaChatClient(httpClient, "llama3");
        });

        return services;
    }


    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IClaimsService, ClaimsService>();
        services.AddScoped<IAIChatClient>(sp => (IAIChatClient)sp.GetRequiredService<IChatClient>());

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