using Resume_builder.Infrastructure.Persistence.Data;

namespace Resume_builder.Infrastructure.Middleware;

public class TransactionMiddleware(RequestDelegate next)
{
    private static readonly HashSet<string> MutationMethods =
        new(StringComparer.OrdinalIgnoreCase) { "POST", "PUT", "PATCH", "DELETE" };

    public async Task InvokeAsync(HttpContext context, AppDbContext db,
        IHostEnvironment env)
    {
        if (!MutationMethods.Contains(context.Request.Method))
        {
            await next(context);
            return;
        }

        await using var transaction =
            env.IsProduction() ? await db.Database.BeginTransactionAsync(context.RequestAborted) : null;

        try
        {
            await next(context);

            if (context.Response.StatusCode is >= 200 and < 300)
                await (transaction?.CommitAsync(context.RequestAborted) ?? Task.CompletedTask);
            else
                await (transaction?.RollbackAsync(context.RequestAborted) ?? Task.CompletedTask);
        }
        catch
        {
            await (transaction?.RollbackAsync(CancellationToken.None) ?? Task.CompletedTask);
            throw;
        }
    }
}