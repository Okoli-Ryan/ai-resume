# Model Creation Flow

This document describes the steps to add a new database-backed entity to the backend.

## 1. Create the Entity Class

Create a new folder under `backend/Resume-builder/Features/<EntityName>/` and add `<EntityName>Entity.cs`.

All entities must extend `BaseEntity` from `Resume_builder.Common`, which provides:
- `Id` (ULID string, primary key)
- `ActiveStatus` (bool)
- `CreatedAt` / `UpdatedAt` (timestamps auto-managed by `AppDbContext.SaveChangesAsync`)

**Example — `FileUploadEntity.cs`:**
```csharp
using System.ComponentModel.DataAnnotations;
using Resume_builder.Common;

namespace Resume_builder.Features.FileUpload;

public class FileUploadEntity : BaseEntity
{
    public string? ResumeId { get; set; }       // nullable FK to Resume
    public string? CoverLetterId { get; set; }  // nullable FK to CoverLetter (future)
    public int Version { get; set; }
    [Required][MaxLength(2048)] public string Url { get; set; } = string.Empty;
}
```

**Conventions:**
- Use `[MaxLength]` on all `string` fields.
- Use `[Required]` on mandatory non-nullable strings.
- Nullable FKs use `string?` (no `[Required]`).
- Navigation properties are declared `virtual`.

## 2. Register in AppDbContext

Open `backend/Resume-builder/Infrastructure/Persistence/Data/AppDbContext.cs`:

1. Add a `using` directive for the new feature namespace.
2. Add a `DbSet<TEntity>` property.

```csharp
// using directives
using Resume_builder.Features.FileUpload;

// inside AppDbContext
public DbSet<FileUploadEntity> FileUpload { get; set; }
```

## 3. Create a Migration

From `backend/Resume-builder/` (where the `.csproj` lives), run:

```bash
dotnet ef migrations add <MigrationName>
```

EF Core will generate a new file under `Migrations/`.

## 4. Apply the Migration (optional locally)

```bash
dotnet ef database update
```

In production the app applies pending migrations at startup via `Database.MigrateAsync()`.

## 5. Verify the Build

```bash
dotnet build
```

All steps should produce zero errors before opening a PR.

---

## CRUD Operations

Once the entity exists in the database, add feature operations following the vertical-slice pattern used across the project. Each operation lives in its own subfolder: `Features/<EntityName>/<OperationName>/`.

### Folder structure

```
Features/
  FileUpload/
    Common/
      FileUploadDto.cs
      FileUploadExtensions.cs
    Create/
      Command.cs
      Handler.cs
      Validator.cs
      Endpoint.cs
    GetById/
      Query.cs
      Handler.cs
      Endpoint.cs
    GetByResumeId/
      Query.cs
      Handler.cs
      Endpoint.cs
    Update/
      Command.cs
      Handler.cs
      Validator.cs
      Endpoint.cs
    Delete/
      Command.cs
      Handler.cs
      Endpoint.cs
```

### Step 1 — DTO and Extensions (`Common/`)

Create a DTO that mirrors the entity (can extend `BaseEntity` for convenience) and an extensions class with `ToDto()` / `ToEntity()` mapping methods.

```csharp
// FileUploadDto.cs
public class FileUploadDto : BaseEntity
{
    public string? ResumeId { get; set; }
    public string? CoverLetterId { get; set; }
    public int Version { get; set; }
    public string Url { get; set; } = string.Empty;
}

// FileUploadExtensions.cs
public static class FileUploadExtensions
{
    public static FileUploadDto ToDto(this FileUploadEntity entity) => new()
    {
        Id = entity.Id, ActiveStatus = entity.ActiveStatus,
        CreatedAt = entity.CreatedAt, UpdatedAt = entity.UpdatedAt,
        ResumeId = entity.ResumeId, CoverLetterId = entity.CoverLetterId,
        Version = entity.Version, Url = entity.Url
    };
}
```

### Step 2 — Command / Query

Each operation defines its own input record or class.

- **Mutations** use a `Command` (record or class carrying all needed parameters).
- **Reads** use a `Query` (record carrying filter parameters).

```csharp
// Create/Command.cs
public class CreateFileUploadCommand
{
    public string? ResumeId { get; set; }
    public string? CoverLetterId { get; set; }
    public int Version { get; set; }
    public string Url { get; set; } = string.Empty;
}

// Delete/Command.cs
public record DeleteFileUploadCommand(string FileUploadId);

// GetById/Query.cs
public record GetFileUploadByIdQuery(string FileUploadId);
```

### Step 3 — Handler

Handlers are plain classes that take `AppDbContext` and `IClaimsService` via constructor injection. They implement `IResponseHandler<TCommand, TResult>`.

Key conventions:
- Always call `claimsService.GetUserId()` and return `401 Unauthorized` if null.
- Return `404 Not Found` when the record does not exist or does not belong to the user.
- Call `db.SaveChangesAsync(cancellationToken)` after mutations.

```csharp
// Create/Handler.cs
public class CreateFileUploadHandler(AppDbContext db, IClaimsService claimsService)
    : IResponseHandler<CreateFileUploadCommand, FileUploadDto>
{
    public async Task<Response<FileUploadDto>> Handle(
        CreateFileUploadCommand request, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        if (userId is null)
            return Response<FileUploadDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var entity = new FileUploadEntity
        {
            ResumeId = request.ResumeId,
            CoverLetterId = request.CoverLetterId,
            Version = request.Version,
            Url = request.Url
        };

        db.FileUpload.Add(entity);
        await db.SaveChangesAsync(cancellationToken);

        return Response<FileUploadDto>.Success(entity.ToDto());
    }
}
```

### Step 4 — Validator

Validators extend `BaseValidator<TRequest>` and use FluentValidation rules. Validators are only created for operations that take user input (create, update).

```csharp
// Create/Validator.cs
public class CreateFileUploadValidator : BaseValidator<CreateFileUploadCommand>
{
    public CreateFileUploadValidator()
    {
        RuleFor(x => x.Url).NotEmpty().MaximumLength(2048);
    }
}
```

### Step 5 — Endpoint

Endpoints implement `ICarterModule` (Carter library). All endpoints for a feature share the same `MapGroup` base path and `WithTags` label.

```csharp
// Create/Endpoint.cs
public class CreateFileUploadEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGroup("file-upload")
            .WithTags("FileUpload")
            .MapPost("", async (
                CreateFileUploadCommand command,
                CreateFileUploadValidator validator,
                CreateFileUploadHandler handler,
                CancellationToken cancellationToken) =>
            {
                var validationError = await validator.ValidateRequest(command);
                if (validationError != null)
                    return Results.BadRequest(validationError);

                var response = await handler.Handle(command, cancellationToken);
                return response.GetResult();
            });
    }
}
```

### HTTP verb conventions

| Operation          | Verb     | Route                          |
|--------------------|----------|--------------------------------|
| Create             | POST     | `/file-upload`                 |
| Get by ID          | GET      | `/file-upload/{id}`            |
| Get by resume      | GET      | `/file-upload/resume/{id}`     |
| Full update        | PUT      | `/file-upload/{id}`            |
| Partial update     | PATCH    | `/file-upload/{id}`            |
| Delete             | DELETE   | `/file-upload/{id}`            |

### Step 6 — DI registration

Carter auto-discovers all `ICarterModule` implementations and FluentValidation validators are registered via `AddValidatorsFromAssemblyContaining<Program>()`. Handler classes are registered explicitly in the DI setup.

Check `Infrastructure/DependencyInjection/` for the handler registration pattern and add the new handlers there.
