using FluentValidation;
using Resume_builder.Common;
using Resume_builder.Features.Resume.Patch_Update_Order;

namespace Resume_builder.Features.Resume.PatchUpdateOrder;

public class PatchUpdateOrderValidator : BaseValidator<PatchUpdateOrderRequest>
{
    private static readonly string[] AllowedOrderValues = 
    [
        "summary", 
        "workExperience", 
        "education", 
        "certifications", 
        "projects", 
        "skills"
    ];

    public PatchUpdateOrderValidator()
    {
        RuleFor(x => x.Order)
            .MaximumLength(500)
            .When(x => x.Order != null)
            .Must(BeValidOrderValues)
            .WithMessage($"Order must contain only comma-separated values from: {string.Join(", ", AllowedOrderValues)}")
            .When(x => !string.IsNullOrEmpty(x.Order));
    }

    private static bool BeValidOrderValues(string? order)
    {
        if (string.IsNullOrEmpty(order))
            return true;

        var values = order.Split(',', StringSplitOptions.RemoveEmptyEntries)
                          .Select(v => v.Trim())
                          .ToArray();

        return values.All(value => AllowedOrderValues.Contains(value, StringComparer.OrdinalIgnoreCase));
    }
}
