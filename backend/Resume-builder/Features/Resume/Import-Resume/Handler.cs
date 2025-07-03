using System.Net;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint;
using Resume_builder.Features.Education;
using Resume_builder.Features.Project;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Features.Skills;
using Resume_builder.Features.WorkExperience;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.AIChatClient;
using Resume_builder.Infrastructure.Services.ClaimService;
using Resume_builder.Utils;

namespace Resume_builder.Features.Resume.Import_Resume;

public class ImportResumeHandler(
    IClaimsService claimsService,
    IAIChatClient chatClient,
    IHostEnvironment env,
    AppDbContext db) : IResponseHandler<ImportResumeCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(ImportResumeCommand command,
        CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        string rawText;

        try
        {
            rawText = PdfLinkExtractor.ExtractTextWithLinksFromBase64(command.Base64String);
        }
        catch
        {
            return Response<ResumeDto>.Fail(HttpStatusCode.BadRequest, "Unable to parse resume.");
        }

        var response = await chatClient.ParseResume(rawText, cancellationToken);

        if (response.Response is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Unable to parse resume.");

        var resume = response.Response;

        await using var transaction =
            env.IsProduction() ? await db.Database.BeginTransactionAsync(cancellationToken) : null;

        var newResume = new ResumeEntity
        {
            ResumeName = RandomStringGenerator.Generate(16),
            UserFullName = resume.UserFullName,
            UserEmail = resume.UserEmail,
            TextSummary = resume.TextSummary,
            JobRole = resume.JobRole,
            UserAddress = resume.UserAddress,
            IsFavourite = false,
            UserPhoneNumber = resume.UserPhoneNumber,
            LinkedinUrl = resume.LinkedinUrl,
            GithubUrl = resume.GithubUrl,
            PortfolioUrl = resume.PortfolioUrl,
            Tags = string.Join(",", resume.Tags),
            UserId = userId
        };

        db.Add(newResume);
        await db.SaveChangesAsync(cancellationToken);


        newResume.Education = resume.Education?.Select(x =>
        {
            var education = new EducationEntity
            {
                SchoolName = x.SchoolName,
                Degree = x.Degree,
                FieldOfStudy = x.FieldOfStudy,
                Location = x.Location,
                IsOngoing = x.IsOngoing,
                StartDate = x.StartDate is not null ? DateTimeOffset.Parse(x.StartDate).UtcDateTime : null,
                EndDate = x.EndDate is not null ? DateTimeOffset.Parse(x.EndDate).UtcDateTime : null,
                ResumeId = newResume.Id,
                UserId = userId
            };

            return education;
        }).ToList();


        newResume.WorkExperience = resume.WorkExperience?.Select(x =>
        {
            var workExperience = new WorkExperienceEntity
            {
                ResumeId = newResume.Id,
                UserId = userId,
                CompanyName = x.CompanyName,
                CompanyLink = x.CompanyLink,
                Title = x.Title,
                StartDate = x.StartDate is not null ? DateTimeOffset.Parse(x.StartDate).UtcDateTime : null,
                EndDate = x.EndDate is not null ? DateTimeOffset.Parse(x.EndDate).UtcDateTime : null,
                IsOngoing = x.IsOngoing,
                Location = x.Location,
                WorkType = x.WorkType
            };
            return workExperience;
        }).ToList();


        newResume.Projects = resume.Projects.Select(x =>
        {
            var project = new ProjectEntity
            {
                ProjectName = x.ProjectName,
                ProjectUrl = x.ProjectName,
                ResumeId = newResume.Id,
                UserId = userId
            };

            return project;
        }).ToList();


        newResume.Skills = resume.Skills?.Select(x =>
        {
            var skill = new SkillEntity
            {
                Group = x.Category,
                Skills = string.Join(",", x.Skills),
                ResumeId = newResume.Id,
                UserId = userId
            };
            return skill;
        }).ToList();


        await db.SaveChangesAsync(cancellationToken);


        foreach (var (work, index) in (resume.WorkExperience ?? []).Select((value, i) => (value, i)))
        foreach (var bulletPoint in work.BulletPoints)
        {
            var workExperienceList = newResume.WorkExperience ?? [];

            workExperienceList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = index,
                WorkExperienceId = workExperienceList[index].Id
            });
        }


        foreach (var (education, index) in (resume.Education ?? []).Select((value, i) => (value, i)))
        foreach (var bulletPoint in education.BulletPoints)
        {
            var educationList = newResume.Education ?? [];

            educationList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = index,
                EducationId = educationList[index].Id
            });
        }


        foreach (var (project, index) in (resume.Projects ?? []).Select((value, i) => (value, i)))
        foreach (var bulletPoint in project.BulletPoints)
        {
            var projectList = newResume.Projects ?? [];

            projectList[index].BulletPoints.Add(new BulletPointEntity
            {
                Text = bulletPoint,
                Order = index,
                ProjectId = projectList[index].Id
            });
        }


        await db.SaveChangesAsync(cancellationToken);

        if (env.IsProduction()) await transaction!.CommitAsync(cancellationToken);
        return Response<ResumeDto>.Success(newResume.ToDto());
    }
}