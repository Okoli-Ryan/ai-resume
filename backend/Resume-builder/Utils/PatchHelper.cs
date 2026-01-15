namespace Resume_builder.Utils;

/// <summary>
/// Helper utility for PATCH operations that handles null checks efficiently
/// </summary>
public static class PatchHelper
{
    /// <summary>
    /// Updates a property only if the new value is not null
    /// </summary>
    /// <typeparam name="T">Type of the property</typeparam>
    /// <param name="currentValue">Current value of the property</param>
    /// <param name="newValue">New value to set (if not null)</param>
    /// <returns>The value to use (new value if not null, otherwise current value)</returns>
    public static T ApplyPatch<T>(T currentValue, T? newValue) where T : class
    {
        return newValue ?? currentValue;
    }

    /// <summary>
    /// Updates a nullable property only if the new value is provided (not null in the request context)
    /// For value types, we need a different approach using a wrapper or checking if value was provided
    /// </summary>
    public static T? ApplyNullablePatch<T>(T? currentValue, T? newValue, bool wasProvided) where T : struct
    {
        return wasProvided ? newValue : currentValue;
    }
}
