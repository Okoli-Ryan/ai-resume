using System.Reflection;

namespace Resume_builder.Utils;

/// <summary>
///     Helper class for performing patch updates on entities
/// </summary>
public static class PatchUpdateHelper
{
    /// <summary>
    ///     Applies non-null values from the source object to the target entity.
    ///     Uses a property mapping dictionary to map source properties to target properties.
    /// </summary>
    /// <typeparam name="TSource">The type of the source (request) object</typeparam>
    /// <typeparam name="TTarget">The type of the target (entity) object</typeparam>
    /// <param name="source">The source object containing the patch values</param>
    /// <param name="target">The target entity to be updated</param>
    /// <param name="propertyMappings">Dictionary mapping source property names to target property names</param>
    /// <returns>True if any property was updated, false otherwise</returns>
    public static bool ApplyPatch<TSource, TTarget>(
        TSource source,
        TTarget target,
        Dictionary<string, string> propertyMappings)
        where TSource : class
        where TTarget : class
    {
        if (source == null) throw new ArgumentNullException(nameof(source));
        if (target == null) throw new ArgumentNullException(nameof(target));
        if (propertyMappings == null) throw new ArgumentNullException(nameof(propertyMappings));

        var sourceType = typeof(TSource);
        var targetType = typeof(TTarget);
        var hasUpdates = false;

        foreach (var mapping in propertyMappings)
        {
            var sourceProperty = sourceType.GetProperty(mapping.Key, BindingFlags.Public | BindingFlags.Instance);
            var targetProperty = targetType.GetProperty(mapping.Value, BindingFlags.Public | BindingFlags.Instance);

            if (sourceProperty == null || targetProperty == null)
                continue;

            var sourceValue = sourceProperty.GetValue(source);

            // Only update if the source value is not null
            if (sourceValue != null)
            {
                targetProperty.SetValue(target, sourceValue);
                hasUpdates = true;
            }
        }

        return hasUpdates;
    }

    /// <summary>
    ///     Applies non-null values from the source object to the target entity.
    ///     Automatically maps properties with the same name.
    /// </summary>
    /// <typeparam name="TSource">The type of the source (request) object</typeparam>
    /// <typeparam name="TTarget">The type of the target (entity) object</typeparam>
    /// <param name="source">The source object containing the patch values</param>
    /// <param name="target">The target entity to be updated</param>
    /// <param name="excludeProperties">Optional list of property names to exclude from patching</param>
    /// <returns>True if any property was updated, false otherwise</returns>
    public static bool ApplyPatchAutoMap<TSource, TTarget>(
        TSource source,
        TTarget target,
        params string[] excludeProperties)
        where TSource : class
        where TTarget : class
    {
        if (source == null) throw new ArgumentNullException(nameof(source));
        if (target == null) throw new ArgumentNullException(nameof(target));

        var sourceType = typeof(TSource);
        var targetType = typeof(TTarget);
        var sourceProperties = sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var excludeSet = new HashSet<string>(excludeProperties ?? Array.Empty<string>());
        var hasUpdates = false;

        foreach (var sourceProperty in sourceProperties)
        {
            if (excludeSet.Contains(sourceProperty.Name))
                continue;

            var targetProperty = targetType.GetProperty(sourceProperty.Name, BindingFlags.Public | BindingFlags.Instance);

            if (targetProperty == null || !targetProperty.CanWrite)
                continue;

            var sourceValue = sourceProperty.GetValue(source);

            // Only update if the source value is not null
            if (sourceValue != null)
            {
                // Ensure type compatibility
                if (targetProperty.PropertyType.IsAssignableFrom(sourceProperty.PropertyType))
                {
                    targetProperty.SetValue(target, sourceValue);
                    hasUpdates = true;
                }
            }
        }

        return hasUpdates;
    }
}
