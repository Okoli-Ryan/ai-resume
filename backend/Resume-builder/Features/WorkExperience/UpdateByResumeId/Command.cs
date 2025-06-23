using Resume_builder.Features.WorkExperience.Update;

namespace Resume_builder.Features.WorkExperience.UpdateByResumeId;

public record UpdateWorkExperienceByResumeIdCommand(string ResumeId, List<UpdateWorkExperienceRequest> WorkExperiences);
