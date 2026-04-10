using System.Text;
using Carter;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Drawing;
using Resume_builder.Common;
using Resume_builder.Features.PdfGeneration;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.OpenAI;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Infrastructure.Services.FileStorageService;
using Resume_builder.Infrastructure.Services.PasswordService;
using Resume_builder.Infrastructure.Services.TokenService;
using Resume_builder.Infrastructure.Services.UrlShortenerService.Common;
using Resume_builder.Infrastructure.Services.UrlShortenerService.ShortIo;

namespace Resume_builder.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services
            .AddConfig(config)
            .AddQuestPDFFont()
            .AddPersistence(config)
            .AddRepositories()
            .AddHandlers()
            .AddServices()
            .AddAuth(config)
            .AddHttpContextAccessor()
            .AddValidatorsFromAssembly(typeof(Program).Assembly)
            .AddSwaggerGen()
            .AddCarter()
            .AddHttpClient()
            .AddAiChatClient(config)
            .AddOpenApi();
    }


    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IResumeRepository, ResumeRepository>();

        return services;
    }


    private static IServiceCollection AddHandlers(this IServiceCollection services)
    {
        var handlerTypes = typeof(Program).Assembly.DefinedTypes
            .Where(type => type is { IsClass: true, IsAbstract: false } &&
                           type.Name.EndsWith("Handler", StringComparison.Ordinal));

        foreach (var handlerType in handlerTypes)
        {
            services.AddScoped(handlerType.AsType());

            var responseHandlerInterfaces = handlerType.ImplementedInterfaces
                .Where(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IResponseHandler<,>));

            foreach (var responseHandlerInterface in responseHandlerInterfaces)
                services.AddScoped(responseHandlerInterface, handlerType.AsType());
        }

        return services;
    }


    private static IServiceCollection AddAiChatClient(this IServiceCollection services, IConfiguration config)
    {
        var appSettings = config
            .GetSection("AppSettings")
            .Get<AppSettings>()!;

        services.AddChatClient(new OpenAiChatClient("gpt-4.1-nano", appSettings.OpenAIKey));

        return services;
    }


    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IClaimsService, ClaimsService>();
        services.AddScoped<IAIChatClient>(sp => (IAIChatClient)sp.GetRequiredService<IChatClient>());
        services.AddScoped<IFileStorageService, UploadCareFileStorageService>();
        services.AddSingleton<IPdfGenerationService, PdfGenerationService>();
        services.AddHttpClient<IUrlShortenerService, ShortIoService>();

        return services;
    }

    private static IServiceCollection AddConfig(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<AppSettings>(config.GetSection("AppSettings"));

        services.AddSwaggerGen();

        return services;
    }

    private static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration config)
    {
        var appSettings = config
            .GetSection("AppSettings")
            .Get<AppSettings>()!;

        // var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
        //
        // if (isDevelopment)
        //
        //     services.AddDbContext<AppDbContext>(options => { options.UseInMemoryDatabase("LocalTestDb"); });
        // else

        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(appSettings.DbConnectionString));

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

    private static IServiceCollection AddQuestPDFFont(this IServiceCollection services)
    {
        var fontPath = Path.Combine(
            AppContext.BaseDirectory,
            "Resources",
            "Fonts",
            "times-new-roman.ttf"
        );

        var fontBytes = File.ReadAllBytes(fontPath);
        FontManager.RegisterFont(new MemoryStream(fontBytes));

        return services;
    }
}