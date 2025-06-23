using FluentValidation;

namespace Resume_builder.Common;

public abstract class BaseValidator<T>() : AbstractValidator<T>()
{
    
    public async Task<string?> ValidateRequest(T request)
    {
        
        var result = await ValidateAsync(request);

        if (result.IsValid) return null;

        return result.Errors[0].ErrorMessage;
    }
}