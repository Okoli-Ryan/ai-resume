using Resume_builder.Features.Project.Update;

namespace Resume_builder.Features.Project.UpdateByResumeId;

public record UpdateProjectsByResumeIdCommand(string ResumeId, List<UpdateProjectRequest> Projects);