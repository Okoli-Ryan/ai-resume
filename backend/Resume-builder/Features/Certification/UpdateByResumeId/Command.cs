using Resume_builder.Features.Certification.Update;

namespace Resume_builder.Features.Certification.UpdateByResumeId;

public record UpdateCertificationByResumeIdCommand(string ResumeId, List<UpdateCertificationRequest> Requests);
