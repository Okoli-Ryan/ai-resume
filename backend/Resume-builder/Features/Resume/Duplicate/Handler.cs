using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Features.BulletPoint.Common;
using Resume_builder.Features.Education.Create;
using Resume_builder.Features.Project.Create;
using Resume_builder.Features.Resume.Common;
using Resume_builder.Features.Resume.Create;
using Resume_builder.Features.Skills.Create;
using Resume_builder.Features.WorkExperience.Create;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Repositories.ResumeRepository;
using Resume_builder.Infrastructure.Services.ClaimService;
using static Resume_builder.Features.Resume.Common.ResumeExtensions;

namespace Resume_builder.Features.Resume.Duplicate;

public class DuplicateResumeHandler(
    AppDbContext db,
    IClaimsService claimsService,
    IResumeRepository resumeRepository,
    IHostEnvironment env) : IResponseHandler<DuplicateResumeCommand, ResumeDto>
{
    public async Task<Response<ResumeDto>> Handle(DuplicateResumeCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();

        if (userId is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await resumeRepository.GetResumeByUserAndResumeId(userId, command.ResumeId, cancellationToken);

        if (resume is null)
            return Response<ResumeDto>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var newResumeEntity = new ResumeEntity
        {
            ResumeName = resume.ResumeName + " Copy",
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
            Tags = resume.Tags,
            UserId = userId
        };

        var resumeCommand = new CreateResumeCommand
        {
            UserName = resume.UserFullName,
            ResumeName = resume.ResumeName,
            Email = resume.UserEmail,
            Summary = resume.TextSummary,
            Role = resume.JobRole,
            Address = resume.UserAddress,
            PhoneNumber = resume.UserPhoneNumber,
            LinkedinUrl = resume.LinkedinUrl,
            GithubUrl = resume.GithubUrl,
            PortfolioUrl = resume.PortfolioUrl,
            Tags = resume.Tags
        };

        resumeCommand.Education = (resume.Education ?? []).Select(x => new CreateEducationCommand
        {
            SchoolName = x.SchoolName,
            Degree = x.Degree,
            FieldOfStudy = x.FieldOfStudy,
            Location = x.Location,
            IsOngoing = x.IsOngoing,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            ResumeId = x.ResumeId,
            BulletPoints = x.BulletPoints.Select(bp => new BulletPointDto
            {
                Text = bp.Text,
                Order = bp.Order,
                EducationId = bp.EducationId
            }).ToList()
        }).ToList();


        resumeCommand.Projects = (resume.Projects ?? []).Select(x => new CreateProjectCommand
        {
            Name = x.ProjectName,
            Link = x.ProjectUrl,
            Order = 0,
            ResumeId = resume.Id,
            BulletPoints = x.BulletPoints.Select(bp => new BulletPointDto
            {
                Text = bp.Text,
                Order = bp.Order,
                ProjectId = bp.ProjectId
            }).ToList()
        }).ToList();

        resumeCommand.WorkExperience = (resume.WorkExperience ?? []).Select(x => new CreateWorkExperienceCommand
        {
            ResumeId = x.ResumeId,
            CompanyName = x.CompanyName,
            CompanyLink = x.CompanyLink,
            Title = x.Title,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            IsOngoing = x.IsOngoing,
            Location = x.Location,
            WorkType = x.WorkType,
            BulletPoints = x.BulletPoints.Select(bp => new BulletPointDto
            {
                Text = bp.Text,
                Order = bp.Order,
                WorkExperienceId = bp.WorkExperienceId
            }).ToList()
        }).ToList();


        resumeCommand.Skills = (resume.Skills ?? []).Select(x => new CreateSkillCommand
        {
            Group = x.Group,
            Skills = x.Skills,
            ResumeId = x.ResumeId
        }).ToList();


        await using var transaction =
            env.IsProduction() ? await db.Database.BeginTransactionAsync(cancellationToken) : null;

        db.Resume.Add(newResumeEntity);
        await db.SaveChangesAsync(cancellationToken);

        CreateEducationEntity(resumeCommand, newResumeEntity, userId);

        CreateWorkExperienceEntity(resumeCommand, newResumeEntity, userId);

        CreateProjectEntity(resumeCommand, newResumeEntity, userId);

        CreateSkillEntity(resumeCommand, newResumeEntity, userId);

        await db.SaveChangesAsync(cancellationToken);

        AssignWorkExperienceIdToBulletPoints(resumeCommand, newResumeEntity);

        AssignProjectIdToBulletPoints(resumeCommand, newResumeEntity);

        AssignEducationIdToBulletPoints(resumeCommand, newResumeEntity);

        await db.SaveChangesAsync(cancellationToken);

        if (env.IsProduction()) await transaction!.CommitAsync(cancellationToken);
        return Response<ResumeDto>.Success(newResumeEntity.ToDto());
    }
}