using Microsoft.EntityFrameworkCore;
using Resume_builder.Infrastructure.Persistence.Data;

namespace Resume_builder.Infrastructure.Middleware;

public class TransactionMiddleware(RequestDelegate next)
{
    private static readonly HashSet<string> MutationMethods =
        new(StringComparer.OrdinalIgnoreCase) { "POST", "PUT", "PATCH", "DELETE" };

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        if (!MutationMethods.Contains(context.Request.Method))
        {
            await next(context);
            return;
        }

        await using var transaction = await db.Database.BeginTransactionAsync(context.RequestAborted);

        try
        {
            await next(context);

            if (context.Response.StatusCode is >= 200 and < 300)
                await transaction.CommitAsync(context.RequestAborted);
            else
                await transaction.RollbackAsync(context.RequestAborted);
        }
        catch
        {
            await transaction.RollbackAsync(CancellationToken.None);
            throw;
        }
    }
}
