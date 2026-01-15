using Resume_builder.Features.Certification.Common;
using Resume_builder.Features.Education.Common;
using Resume_builder.Features.Link;
using Resume_builder.Features.Project.Common;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Features.WorkExperience.Common;

namespace Resume_builder.Features.Resume.GetSections;

/// <summary>
/// Response containing all sections of a resume grouped by type
/// </summary>
public class ResumeSectionsResponse
{
    public List<ProjectDto>? Projects { get; set; }
    public List<EducationDto>? Education { get; set; }
    public List<WorkExperienceDto>? WorkExperience { get; set; }
    public List<SkillDto>? Skills { get; set; }
    public List<LinkDto>? Links { get; set; }
    public List<CertificationDto>? Certifications { get; set; }
}

/// <summary>
/// Response for a specific section type
/// </summary>
public class SectionResponse<T>
{
    public string SectionType { get; set; } = string.Empty;
    public List<T>? Items { get; set; }
}
