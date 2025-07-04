using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Education;
using Resume_builder.Features.Project;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Features.Skills;
using Resume_builder.Features.WorkExperience;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.AIChatClient.Common;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.GenerateResume;

public class GenerateResumeHandler(
    AppDbContext db,
    IClaimsService claimsService,
    IHostEnvironment env,
    IAIChatClient chatClient)
    : IResponseHandler<GenerateResumeCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(GenerateResumeCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId == null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == command.ResumeId)
            .AsNoTracking()
            .Include(x => x.Projects)
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.Education)
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.WorkExperience)
            .ThenInclude(x => x.BulletPoints)
            .Include(x => x.Skills)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var additionalInfo = new ResumeAdditionalInfo
        {
            JobDescription = command.AdditionalInfo?.JobDescription,
            Tags = command.AdditionalInfo?.Tags
        };

        var aiResponse = await chatClient.GenerateResume(resume, additionalInfo, cancellationToken);

        if (aiResponse.Response is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Unable to generate resume");

        var newResume = CreateResumeEntity(resume, aiResponse, userId);

        await using var transaction =
            env.IsProduction() ? await db.Database.BeginTransactionAsync(cancellationToken) : null;

        db.Add(newResume);
        await db.SaveChangesAsync(cancellationToken);

        CreateProjectEntity(newResume, aiResponse, userId);

        CreateSkillsEntity(newResume, aiResponse, userId);

        CreateWorkExperienceEntity(newResume, aiResponse, userId);

        CreateEducationEntity(newResume, resume, userId);

        await db.SaveChangesAsync(cancellationToken);

        AssignBulletPointsToWorkExperience(aiResponse, resume);

        AssignBulletPointsToProject(aiResponse, resume);

        AssignBulletPointsToEducation(resume);

        await db.SaveChangesAsync(cancellationToken);

        if (env.IsProduction()) await transaction!.CommitAsync(cancellationToken);

        return Response<ResumeDto>.Success(newResume.ToDto());
    }

    private static void CreateEducationEntity(ResumeEntity newResume, ResumeEntity resume, string userId)
    {
        newResume.Education = (resume.Education ?? []).Select(x => new EducationEntity
        {
            SchoolName = x.SchoolName,
            Degree = x.Degree,
            FieldOfStudy = x.FieldOfStudy,
            Location = x.Location,
            IsOngoing = x.IsOngoing,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            ResumeId = newResume.Id,
            UserId = userId
        }).ToList();
    }

    private static void CreateWorkExperienceEntity(ResumeEntity newResume,
        AIResponse<GenerateResumeResponse?> aiResponse, string userId)
    {
        newResume.WorkExperience = aiResponse.Response?.WorkExperience.Select(x => new WorkExperienceEntity
        {
            ResumeId = newResume.Id,
            UserId = userId,
            CompanyName = x.CompanyName,
            CompanyLink = x.CompanyLink,
            Title = x.Role,
            StartDate = x.StartTime,
            EndDate = x.EndTime,
            IsOngoing = x.IsOngoing,
            Location = x.Location,
            WorkType = x.WorkType
        }).ToList();
    }

    private static void CreateSkillsEntity(ResumeEntity newResume, AIResponse<GenerateResumeResponse?> aiResponse,
        string userId)
    {
        newResume.Skills = aiResponse.Response?.Skills.Select(x => new SkillEntity
        {
            Group = x.Category,
            Skills = x.Skills,
            UserId = userId,
            ResumeId = newResume.Id
        }).ToList();
    }

    private static void CreateProjectEntity(ResumeEntity newResume, AIResponse<GenerateResumeResponse?> aiResponse,
        string userId)
    {
        newResume.Projects = aiResponse.Response?.Projects.Select(x => new ProjectEntity
        {
            ProjectName = x.ProjectName,
            ProjectUrl = x.ProjectUrl,
            ResumeId = newResume.Id,
            UserId = userId
        }).ToList();
    }

    private static ResumeEntity CreateResumeEntity(ResumeEntity resume, AIResponse<GenerateResumeResponse?> aiResponse,
        string userId)
    {
        var newResume = new ResumeEntity
        {
            ResumeName = resume.ResumeName,
            UserFullName = resume.UserFullName,
            UserEmail = resume.UserEmail,
            TextSummary = aiResponse.Response?.Summary,
            JobRole = resume.JobRole,
            IsFavourite = resume.IsFavourite,
            UserAddress = resume.UserAddress,
            UserPhoneNumber = resume.UserPhoneNumber,
            Order = resume.Order,
            LinkedinUrl = resume.LinkedinUrl,
            GithubUrl = resume.GithubUrl,
            PortfolioUrl = resume.PortfolioUrl,
            Tags = aiResponse.Response?.Tags,
            UserId = userId
        };
        return newResume;
    }

    private static void CreateSkillsEntity(AIResponse<GenerateResumeResponse?> aiResponse, ResumeEntity newResume,
        string userId)
    {
        foreach (var skillCategory in aiResponse.Response.Skills)
            newResume.Skills = aiResponse.Response.Skills.Select(x => new SkillEntity
            {
                Group = skillCategory.Category,
                Skills = skillCategory.Skills,
                UserId = userId,
                ResumeId = newResume.Id
            }).ToList();
    }

    private static void AssignBulletPointsToEducation(ResumeEntity resume)
    {
        foreach (var (education, index) in (resume.Education ?? []).Select((value, i) => (value, i)))
        foreach (var (bulletPoint, bpIndex) in education.BulletPoints.Select((value, i) => (value, i)))
        {
            var educationList = resume.Projects ?? [];

            educationList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint.Text,
                Order = bpIndex,
                EducationId = educationList[index].Id
            });
        }
    }

    private static void AssignBulletPointsToProject(AIResponse<GenerateResumeResponse?> aiResponse, ResumeEntity resume)
    {
        foreach (var (project, index) in (aiResponse.Response?.Projects ?? []).Select((value, i) => (value, i)))
        foreach (var (bulletPoint, bpIndex) in project.BulletPoints.Select((value, i) => (value, i)))
        {
            var projectList = resume.Projects ?? [];

            projectList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = bpIndex,
                ProjectId = projectList[index].Id
            });
        }
    }

    private static void AssignBulletPointsToWorkExperience(AIResponse<GenerateResumeResponse?> aiResponse,
        ResumeEntity resume)
    {
        foreach (var (work, index) in (aiResponse.Response?.WorkExperience ?? []).Select((value, i) => (value, i)))
        foreach (var (bulletPoint, bpIndex) in work.BulletPoints.Select((value, i) => (value, i)))
        {
            var workExperienceList = resume.WorkExperience ?? [];

            workExperienceList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = bpIndex,
                WorkExperienceId = workExperienceList[index].Id
            });
        }
    }
}