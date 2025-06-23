using Resume_builder.Features.Skills.Update;

namespace Resume_builder.Features.Skills.UpdateByResumeId;

public record UpdateSkillsByResumeIdCommand(string ResumeId, List<UpdateSkillRequest> Skills);
