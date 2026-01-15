using System.Net;
using Microsoft.EntityFrameworkCore;
using Resume_builder.Common;
using Resume_builder.Infrastructure.Persistence.Data;
using Resume_builder.Infrastructure.Services.ClaimService;

namespace Resume_builder.Features.Resume.TailorToRole;

public class TailorResumeHandler(
    AppDbContext db,
    IClaimsService claimsService) : IResponseHandler<TailorResumeCommand, TailorResumeResponse>
{
    // Common role-based section ordering templates
    private static readonly Dictionary<string, string> RoleOrderTemplates = new()
    {
        ["frontend developer"] = "WorkExperience,Projects,Skills,Education,Certifications",
        ["frontend engineer"] = "WorkExperience,Projects,Skills,Education,Certifications",
        ["backend developer"] = "WorkExperience,Skills,Projects,Education,Certifications",
        ["backend engineer"] = "WorkExperience,Skills,Projects,Education,Certifications",
        ["fullstack developer"] = "WorkExperience,Skills,Projects,Education,Certifications",
        ["fullstack engineer"] = "WorkExperience,Skills,Projects,Education,Certifications",
        ["data scientist"] = "WorkExperience,Education,Skills,Projects,Certifications",
        ["data engineer"] = "WorkExperience,Skills,Projects,Education,Certifications",
        ["devops engineer"] = "WorkExperience,Skills,Certifications,Projects,Education",
        ["sre"] = "WorkExperience,Skills,Certifications,Projects,Education",
        ["machine learning engineer"] = "WorkExperience,Education,Skills,Projects,Certifications",
        ["mobile developer"] = "WorkExperience,Projects,Skills,Education,Certifications",
        ["default"] = "WorkExperience,Education,Skills,Projects,Certifications"
    };

    public async Task<Response<TailorResumeResponse>> Handle(TailorResumeCommand command, CancellationToken cancellationToken)
    {
        var userId = claimsService.GetUserId();
        if (userId is null)
            return Response<TailorResumeResponse>.Fail(HttpStatusCode.Unauthorized, "Unauthorized");

        var resume = await db.Resume
            .Where(x => x.UserId == userId && x.Id == command.ResumeId)
            .FirstOrDefaultAsync(cancellationToken);

        if (resume == null)
            return Response<TailorResumeResponse>.Fail(HttpStatusCode.NotFound, "Resume not found");

        var targetRole = command.TargetRole.ToLower().Trim();
        
        // Find best matching template - try exact match first, then partial
        var suggestedOrder = RoleOrderTemplates["default"];
        
        // Try exact match
        if (RoleOrderTemplates.TryGetValue(targetRole, out var exactMatch))
        {
            suggestedOrder = exactMatch;
        }
        else
        {
            // Try partial match with word boundaries
            foreach (var template in RoleOrderTemplates)
            {
                if (template.Key != "default" && targetRole.Contains(template.Key))
                {
                    suggestedOrder = template.Value;
                    break;
                }
            }
        }

        // Build section priorities
        var sectionPriorities = new Dictionary<string, string>();
        var sections = suggestedOrder.Split(',');
        for (int i = 0; i < sections.Length; i++)
        {
            sectionPriorities[sections[i]] = $"Priority {i + 1}";
        }

        // Generate role-specific recommendations
        var recommendedSections = GenerateRecommendedSections(targetRole);

        var response = new TailorResumeResponse
        {
            ResumeId = command.ResumeId,
            TargetRole = command.TargetRole,
            SuggestedOrder = suggestedOrder,
            SuggestedSummary = GenerateSummaryGuidance(command.TargetRole),
            RecommendedSections = recommendedSections,
            SectionPriorities = sectionPriorities
        };

        return Response<TailorResumeResponse>.Success(response);
    }

    private List<string> GenerateRecommendedSections(string role)
    {
        var recommendations = new List<string>
        {
            "WorkExperience",
            "Skills"
        };

        if (role.Contains("data") || role.Contains("machine learning") || role.Contains("scientist"))
        {
            recommendations.Add("Education");
            recommendations.Add("Projects");
            recommendations.Add("Certifications");
        }
        else if (role.Contains("frontend") || role.Contains("mobile") || role.Contains("ui"))
        {
            recommendations.Add("Projects");
            recommendations.Add("Education");
        }
        else if (role.Contains("devops") || role.Contains("sre"))
        {
            recommendations.Add("Certifications");
            recommendations.Add("Projects");
            recommendations.Add("Education");
        }
        else
        {
            recommendations.Add("Projects");
            recommendations.Add("Education");
            recommendations.Add("Certifications");
        }

        return recommendations;
    }

    private string GenerateSummaryGuidance(string role)
    {
        return $"Consider emphasizing your {role} experience, relevant technical skills, and measurable achievements in your summary. Highlight 2-3 key accomplishments that align with {role} responsibilities.";
    }
}
