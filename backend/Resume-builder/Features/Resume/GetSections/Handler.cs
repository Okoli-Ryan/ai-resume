using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.Certification.Common;
using Resume_builder.Features.Education.Common;
using Resume_builder.Features.Link;
using Resume_builder.Features.Link.Common;
using Resume_builder.Features.Project.Common;
using Resume_builder.Features.Skills.Common;
using Resume_builder.Features.WorkExperience.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GetSections;

public class GetAllSectionsHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<string, ResumeSectionsResponse>
{
    public async Task<Response<ResumeSectionsResponse>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        if (userId is null)
            return Response<ResumeSectionsResponse>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Include(r => r.Projects)
            .Include(r => r.Education)
            .Include(r => r.WorkExperience)
            .Include(r => r.Skills)
            .Include(r => r.Links)
            .Include(r => r.Certifications)
            .Where(x => x.UserId == userId && x.Id == resumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<ResumeSectionsResponse>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var response = new ResumeSectionsResponse
        {
            Projects = resume.Projects?.Select(p => p.ToDto()).ToList(),
            Education = resume.Education?.Select(e => e.ToDto()).ToList(),
            WorkExperience = resume.WorkExperience?.Select(w => w.ToDto()).ToList(),
            Skills = resume.Skills?.Select(s => s.ToDto()).ToList(),
            Links = resume.Links?.Select(l => l.ToDto()).ToList(),
            Certifications = resume.Certifications?.Select(c => c.ToDto()).ToList()
        };

        return Response<ResumeSectionsResponse>.Success(response);
    }
}

public class GetProjectsSectionHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<string, SectionResponse<ProjectDto>>
{
    public async Task<Response<SectionResponse<ProjectDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        if (userId is null)
            return Response<SectionResponse<ProjectDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Include(r => r.Projects)
            .Where(x => x.UserId == userId && x.Id == resumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<SectionResponse<ProjectDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var response = new SectionResponse<ProjectDto>
        {
            SectionType = "Projects",
            Items = resume.Projects?.Select(p => p.ToDto()).ToList()
        };

        return Response<SectionResponse<ProjectDto>>.Success(response);
    }
}

public class GetEducationSectionHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<string, SectionResponse<EducationDto>>
{
    public async Task<Response<SectionResponse<EducationDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        if (userId is null)
            return Response<SectionResponse<EducationDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Include(r => r.Education)
            .Where(x => x.UserId == userId && x.Id == resumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<SectionResponse<EducationDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var response = new SectionResponse<EducationDto>
        {
            SectionType = "Education",
            Items = resume.Education?.Select(e => e.ToDto()).ToList()
        };

        return Response<SectionResponse<EducationDto>>.Success(response);
    }
}

public class GetWorkExperienceSectionHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<string, SectionResponse<WorkExperienceDto>>
{
    public async Task<Response<SectionResponse<WorkExperienceDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        if (userId is null)
            return Response<SectionResponse<WorkExperienceDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Include(r => r.WorkExperience)
            .Where(x => x.UserId == userId && x.Id == resumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<SectionResponse<WorkExperienceDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var response = new SectionResponse<WorkExperienceDto>
        {
            SectionType = "WorkExperience",
            Items = resume.WorkExperience?.Select(w => w.ToDto()).ToList()
        };

        return Response<SectionResponse<WorkExperienceDto>>.Success(response);
    }
}

public class GetSkillsSectionHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<string, SectionResponse<SkillDto>>
{
    public async Task<Response<SectionResponse<SkillDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        if (userId is null)
            return Response<SectionResponse<SkillDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Include(r => r.Skills)
            .Where(x => x.UserId == userId && x.Id == resumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<SectionResponse<SkillDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var response = new SectionResponse<SkillDto>
        {
            SectionType = "Skills",
            Items = resume.Skills?.Select(s => s.ToDto()).ToList()
        };

        return Response<SectionResponse<SkillDto>>.Success(response);
    }
}

public class GetCertificationsSectionHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<string, SectionResponse<CertificationDto>>
{
    public async Task<Response<SectionResponse<CertificationDto>>> Handle(string resumeId, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        if (userId is null)
            return Response<SectionResponse<CertificationDto>>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Include(r => r.Certifications)
            .Where(x => x.UserId == userId && x.Id == resumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<SectionResponse<CertificationDto>>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var response = new SectionResponse<CertificationDto>
        {
            SectionType = "Certifications",
            Items = resume.Certifications?.Select(c => c.ToDto()).ToList()
        };

        return Response<SectionResponse<CertificationDto>>.Success(response);
    }
}
