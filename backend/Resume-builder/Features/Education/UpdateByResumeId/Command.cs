using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Education.Update;

namespace Resume_builder.Features.Education.UpdateByResumeId;

public record UpdateEducationByResumeIdCommand(string ResumeId, List<UpdateEducationRequest> Requests);
