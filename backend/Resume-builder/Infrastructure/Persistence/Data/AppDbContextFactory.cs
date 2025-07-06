using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Resume_builder.Common;

namespace Resume_builder.Infrastructure.Persistence.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddUserSecrets<Program>(true)
            .AddEnvironmentVariables()
            .Build();

        foreach (var kv in config.AsEnumerable())
            //Temporary log
            Console.WriteLine($"{kv.Key} = {kv.Value}");

        // Manually bind to AppSettings (like IOptions<AppSettings>)
        var appSettings = config.GetSection("AppSettings").Get<AppSettings>();

        var connectionString = appSettings?.DbConnectionString;

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new AppDbContext(optionsBuilder.Options);
    }
}