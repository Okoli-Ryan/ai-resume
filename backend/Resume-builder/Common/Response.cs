using System.Net;

namespace Resume_builder.Common;

public record Response<T>(bool IsSuccess, T? Data, HttpStatusCode Code, string? Error)
{
    public static Response<T> Success(T data)
    {
        return new Response<T>(true, data, HttpStatusCode.OK, string.Empty);
    }

    public static Response<T> Fail(HttpStatusCode code, string? error)
    {
        return new Response<T>(false, default, code, error);
    }
}

public static class ResponseExtensions
{
    public static IResult GetResult<T>(this Response<T> response)
    {
        return response switch
        {
            { IsSuccess: true } => Results.Ok(response.Data),
            { Code: HttpStatusCode.NotFound } => Results.NotFound(response.Error),
            { Code: HttpStatusCode.BadRequest } => Results.BadRequest(response.Error),
            { Code: HttpStatusCode.Unauthorized } => Results.Unauthorized(),
            { Code: HttpStatusCode.Forbidden } => Results.Forbid(),
            { Code: HttpStatusCode.Conflict } => Results.Conflict(response.Error),
            _ => Results.StatusCode((int)response.Code)
        };
    }
}