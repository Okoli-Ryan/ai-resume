using System.Text;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Resume_builder.Utils;

/// <summary>
/// Utility class to format validation errors from ModelStateDictionary
/// into a readable string format for API responses.
/// </summary>
public static class ValidationErrorFormatter
{
    /// <summary>
    /// Formats ModelState errors into a single string containing all field errors.
    /// </summary>
    /// <param name="modelState">The ModelStateDictionary from HttpContext</param>
    /// <returns>A formatted string with all validation errors, or null if no errors exist</returns>
    public static string? FormatModelStateErrors(ModelStateDictionary modelState)
    {
        if (modelState.IsValid)
            return null;

        var errorBuilder = new StringBuilder();
        var errorList = new List<string>();

        foreach (var kvp in modelState)
        {
            var field = kvp.Key;
            var value = kvp.Value;

            if (value?.Errors.Count > 0)
            {
                foreach (var error in value.Errors)
                {
                    // Use the model error message if available, otherwise use the exception message
                    var errorMessage = !string.IsNullOrEmpty(error.ErrorMessage)
                        ? error.ErrorMessage
                        : error.Exception?.Message ?? "Unknown error";

                    errorList.Add($"{field}: {errorMessage}");
                }
            }
        }

        if (errorList.Count == 0)
            return null;

        // Join all errors with semicolon separator for clarity
        return string.Join("; ", errorList);
    }

    /// <summary>
    /// Formats validation errors from FluentValidation into a single string.
    /// </summary>
    /// <param name="errors">Collection of validation failures</param>
    /// <returns>A formatted string with all validation errors</returns>
    public static string FormatFluentValidationErrors(IEnumerable<string> errors)
    {
        var errorList = errors.Where(e => !string.IsNullOrEmpty(e)).ToList();
        
        if (errorList.Count == 0)
            return string.Empty;

        return string.Join("; ", errorList);
    }
}
