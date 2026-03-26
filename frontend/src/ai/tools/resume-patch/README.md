# Resume Patch System - Product Requirements Document

## Overview

The Resume Patch System is a unified tool that consolidates all CRUD (Create, Read, Update, Delete) operations for resume sections into a single AI tool interface. This replaces the previous approach of having separate tools for each section and operation type.

---

## Problem Statement

### Previous Implementation

The previous implementation required **multiple individual tools** for each resume section:

```
Tools Required (Before):
├── patch_update_work_experience
├── patch_update_education  
├── patch_update_project
├── patch_update_certification
├── update_summary
├── update_resume_info
├── update_links
├── update_order
└── (+ potential add/delete tools for each section)
```

**Issues with the previous approach:**

1. **Tool Explosion**: Each section × each operation = many tools for the LLM to understand
2. **Context Overhead**: LLM must learn and remember 10+ tool schemas
3. **Multiple Round Trips**: Batch operations required multiple sequential tool calls
4. **Inconsistent Interfaces**: Each tool had slightly different parameter naming conventions
5. **Higher Token Usage**: More tool definitions = more tokens in every request

---

## Solution: Unified Patch System

### New Implementation

A single `resume_patch` tool that handles all operations through a consistent patch-based interface:

```
Tools Required (After):
└── resume_patch (handles ALL sections and operations)
```

### Patch Structure

```typescript
{
  patches: [
    {
      operation: "add" | "update" | "delete",
      target: {
        section: "workExperience" | "project" | "education" | ...,
        id?: string  // Required for update/delete
      },
      payload?: {
        // Section-specific fields
      }
    }
  ]
}
```

---

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| Number of Tools | 10+ tools | 1 tool |
| Batch Operations | Multiple calls | Single call |
| Schema Consistency | Varies by tool | Uniform structure |
| LLM Context | High overhead | Minimal overhead |
| Token Usage | Higher | Lower |
| Extensibility | Add new tool | Add new section handler |

---

## Supported Sections

| Section | Operations | Key Fields |
|---------|------------|------------|
| `workExperience` | add, update, delete | companyName, title, startDate, endDate, location, bulletPoints |
| `project` | add, update, delete | name, link, bulletPoints |
| `education` | add, update, delete | schoolName, degree, fieldOfStudy, startDate, endDate, bulletPoints |
| `certification` | add, update, delete | certificationName, certificateLink, dateAttained, bulletPoints |
| `skills` | add, update, delete | category, skills (comma-separated) |
| `summary` | update only | summary |
| `resumeInfo` | update only | userName, email, role, phoneNumber, address, linkedinUrl, githubUrl, portfolioUrl |
| `links` | add, update, delete | name, url, index |
| `order` | update only | order (comma-separated section names) |

---

## Use Cases & Sample User Prompts

### Use Case 1: Single Field Update

**User Prompt:** 
> "Change my job title at Google to Senior Software Engineer"

**Previous Implementation:** Required calling `patch_update_work_experience` tool

**New Implementation:**
```json
{
  "patches": [{
    "operation": "update",
    "target": { "section": "workExperience", "id": "abc123" },
    "payload": { "title": "Senior Software Engineer" }
  }]
}
```

---

### Use Case 2: Batch Updates Across Sections

**User Prompt:**
> "Update my summary to focus on leadership, change my role to Engineering Manager, and update my LinkedIn URL"

**Previous Implementation:** Required 3 separate tool calls:
1. `update_summary`
2. `update_resume_info` (for role)
3. `update_links` (for LinkedIn)

**New Implementation:** Single tool call with multiple patches:
```json
{
  "patches": [
    {
      "operation": "update",
      "target": { "section": "summary" },
      "payload": { "summary": "Engineering leader with 10+ years of experience building and scaling high-performance teams..." }
    },
    {
      "operation": "update",
      "target": { "section": "resumeInfo" },
      "payload": { "role": "Engineering Manager" }
    },
    {
      "operation": "update",
      "target": { "section": "resumeInfo" },
      "payload": { "linkedinUrl": "https://linkedin.com/in/newprofile" }
    }
  ]
}
```

---

### Use Case 3: Adding New Entries

**User Prompt:**
> "Add my new AWS certification that I got last month"

**New Implementation:**
```json
{
  "patches": [{
    "operation": "add",
    "target": { "section": "certification" },
    "payload": {
      "certificationName": "AWS Solutions Architect Professional",
      "dateAttained": "2025-12-15",
      "certificateLink": "https://aws.amazon.com/verification/..."
    }
  }]
}
```

---

### Use Case 4: Deleting Entries

**User Prompt:**
> "Remove my internship from 2018, it's not relevant anymore"

**New Implementation:**
```json
{
  "patches": [{
    "operation": "delete",
    "target": { "section": "workExperience", "id": "internship-2018-id" }
  }]
}
```

---

### Use Case 5: Complex Resume Restructuring

**User Prompt:**
> "I'm applying for a tech lead position. Update my current job title to Tech Lead, add a bullet point about mentoring 5 junior developers, update my summary to emphasize leadership, and reorder sections to show experience first"

**New Implementation:** Single call handles everything:
```json
{
  "patches": [
    {
      "operation": "update",
      "target": { "section": "workExperience", "id": "current-job-id" },
      "payload": { 
        "title": "Tech Lead",
        "bulletPoints": [
          { "text": "Mentored and coached 5 junior developers, accelerating their growth and productivity by 40%" }
        ]
      }
    },
    {
      "operation": "update",
      "target": { "section": "summary" },
      "payload": { 
        "summary": "Technical leader with 8+ years of experience in software development and team leadership. Proven track record of mentoring engineers and delivering high-impact projects..."
      }
    },
    {
      "operation": "update",
      "target": { "section": "order" },
      "payload": { 
        "order": "summary,workExperience,projects,skills,education,certifications"
      }
    }
  ]
}
```

---

### Use Case 6: Updating Skills

**User Prompt:**
> "Add Kubernetes and Terraform to my DevOps skills category"

**New Implementation:**
```json
{
  "patches": [{
    "operation": "update",
    "target": { "section": "skills", "id": "devops-skills-id" },
    "payload": { 
      "skills": "Docker, Kubernetes, Terraform, CI/CD, AWS, Jenkins"
    }
  }]
}
```

---

## Sample User Prompts by Category

### Personal Information Updates
- "Update my phone number to 555-123-4567"
- "Change my email to newemail@gmail.com"
- "Add my portfolio website: https://myportfolio.dev"
- "Update my address to San Francisco, CA"

### Work Experience Updates
- "Change my job title at [Company] to [New Title]"
- "Update the end date for my previous job to December 2025"
- "Mark my current position as ongoing"
- "Add a bullet point about the 30% performance improvement I achieved"
- "Remove the third bullet point from my Google experience"

### Education Updates
- "Add my Master's degree from Stanford"
- "Update my graduation date to May 2024"
- "Change my major to Computer Science"
- "Add GPA 3.8 to my education bullet points"

### Project Updates
- "Add my new open source project"
- "Update the link for my portfolio project"
- "Add a description about the technologies used"

### Skills Updates
- "Add Python to my programming languages"
- "Create a new skill category for Cloud Technologies"
- "Remove PHP from my skills"

### Certification Updates
- "Add my new PMP certification"
- "Update the expiration date for my AWS cert"
- "Add the verification link for my certification"

### Layout & Organization
- "Move education before work experience"
- "Put skills at the top of my resume"
- "Reorder sections: summary, skills, experience, projects, education"

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    resume_patch Tool                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Input: { patches: ResumePatch[] }                         │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Zod Schema Validation                   │   │
│   │         (ResumePatchToolSchema)                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │           executePatchBatch()                        │   │
│   │     Iterates through patches sequentially            │   │
│   └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              executePatch()                          │   │
│   │     Routes to section-specific handler               │   │
│   └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│           ┌───────────────┼───────────────┐                 │
│           ▼               ▼               ▼                 │
│   ┌───────────┐   ┌───────────┐   ┌───────────┐            │
│   │WorkExp   │   │ Education │   │  Project  │   ...       │
│   │ Handler  │   │  Handler  │   │  Handler  │             │
│   └───────────┘   └───────────┘   └───────────┘            │
│           │               │               │                 │
│           ▼               ▼               ▼                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Existing Service Layer                  │   │
│   │   (patchUpdateWorkExperience, patchUpdateEducation,  │   │
│   │    patchUpdateProject, etc.)                         │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   Output: { success, summary, details[] }                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Future Enhancements

1. **Add Operations**: Implement `add` handlers for all sections (currently TODOs)
2. **Delete Operations**: Implement `delete` handlers for all sections
3. **Bullet Point Management**: Direct bullet point add/update/delete within patches
4. **Validation Improvements**: Section-specific business logic validation
5. **Rollback Support**: Transaction-like behavior for batch operations
6. **Optimistic Updates**: Return expected state before API confirmation

---

## Implementation Plan: Missing Controllers

### Phase 1: Backend DELETE Endpoints

Each DELETE endpoint follows the same pattern. Create a `Delete/` folder in each feature with:
- `Command.cs` - Request model
- `Handler.cs` - Business logic
- `Validator.cs` - Validation rules (optional)

#### 1.1 WorkExperience DELETE

**Location:** `Features/WorkExperience/Delete/`

```csharp
// Command.cs
public record DeleteWorkExperienceCommand(string WorkExperienceId);

// Handler.cs
public class DeleteWorkExperienceHandler
{
    public async Task<Response<bool>> Handle(DeleteWorkExperienceCommand command, CancellationToken ct)
    {
        var entity = await db.WorkExperiences
            .FirstOrDefaultAsync(x => x.Id == command.WorkExperienceId && x.UserId == userId, ct);
        
        if (entity == null) return Response<bool>.Failure("Work experience not found");
        
        db.WorkExperiences.Remove(entity);
        await db.SaveChangesAsync(ct);
        
        return Response<bool>.Success(true);
    }
}
```

**Endpoint in `WorkExperienceEndpoints.cs`:**
```csharp
endpoint.MapDelete("{workExperienceId}", async (
    string workExperienceId,
    AppDbContext db,
    IClaimsService claimsService,
    CancellationToken cancellationToken) =>
{
    var handler = new DeleteWorkExperienceHandler(db, claimsService);
    var result = await handler.Handle(new DeleteWorkExperienceCommand(workExperienceId), cancellationToken);
    return result.GetResult();
}).WithName("Delete Work Experience");
```

#### 1.2 Education DELETE

**Location:** `Features/Education/Delete/`
- Same pattern as WorkExperience
- Also delete associated BulletPoints (cascade or manual)

#### 1.3 Project DELETE

**Location:** `Features/Project/Delete/`
- Same pattern as WorkExperience
- Also delete associated BulletPoints

#### 1.4 Certification DELETE

**Location:** `Features/Certification/Delete/`
- Same pattern as WorkExperience
- Also delete associated BulletPoints

#### 1.5 Skills DELETE

**Location:** `Features/Skills/Delete/`
- Same pattern as WorkExperience

---

### Phase 2: Backend PATCH Endpoints

#### 2.1 Skills PATCH

**Location:** `Features/Skills/PatchUpdate/`

```csharp
// Command.cs
public record PatchUpdateSkillCommand(string SkillId, PatchUpdateSkillRequest Request);

public class PatchUpdateSkillRequest
{
    public string? Category { get; set; }
    public string? Skills { get; set; }
}

// Handler.cs
public class PatchUpdateSkillHandler
{
    public async Task<Response<SkillDto>> Handle(PatchUpdateSkillCommand command, CancellationToken ct)
    {
        var entity = await db.Skills
            .FirstOrDefaultAsync(x => x.Id == command.SkillId && x.UserId == userId, ct);
        
        if (entity == null) return Response<SkillDto>.Failure("Skill not found");
        
        PatchUpdateHelper.ApplyPatch(entity, command.Request);
        await db.SaveChangesAsync(ct);
        
        return Response<SkillDto>.Success(entity.ToDto());
    }
}
```

**Endpoint in `SkillEndpoints.cs`:**
```csharp
endpoint.MapPatch("{skillId}", async (
    string skillId,
    PatchUpdateSkillRequest request,
    PatchUpdateSkillValidator validator,
    AppDbContext db,
    IClaimsService claimsService,
    CancellationToken cancellationToken) =>
{
    var validationError = await validator.ValidateRequest(request);
    if (validationError != null) return Results.BadRequest(validationError);
    
    var handler = new PatchUpdateSkillHandler(db, claimsService);
    var result = await handler.Handle(new PatchUpdateSkillCommand(skillId, request), cancellationToken);
    return result.GetResult();
}).WithName("Patch Update Skill");
```

#### 2.2 Link PATCH

**Location:** `Features/Link/PatchUpdate/`
- Same pattern as Skills PATCH
- Fields: `Name`, `Url`, `Index`

---

### Phase 3: Frontend Services

#### 3.1 Delete Services

**File:** `services/work-experience/delete-work-experience.ts`
```typescript
import FetchClient from "@/lib/fetch";

export const deleteWorkExperience = async (workExperienceId: string) => {
    return FetchClient.delete<void>(`/work-experience/${workExperienceId}`);
};
```

**File:** `services/education/delete-education.ts`
```typescript
import FetchClient from "@/lib/fetch";

export const deleteEducation = async (educationId: string) => {
    return FetchClient.delete<void>(`/education/${educationId}`);
};
```

**File:** `services/project/delete-project.ts`
```typescript
import FetchClient from "@/lib/fetch";

export const deleteProject = async (projectId: string) => {
    return FetchClient.delete<void>(`/project/${projectId}`);
};
```

**File:** `services/certification/delete-certification.ts`
```typescript
import FetchClient from "@/lib/fetch";

export const deleteCertification = async (certificationId: string) => {
    return FetchClient.delete<void>(`/certification/${certificationId}`);
};
```

**File:** `services/skills/delete-skill.ts`
```typescript
import FetchClient from "@/lib/fetch";

export const deleteSkill = async (skillId: string) => {
    return FetchClient.delete<void>(`/skill/${skillId}`);
};
```

#### 3.2 Create Services (Frontend Wrappers)

**File:** `services/work-experience/create-work-experience.ts`
```typescript
import FetchClient from "@/lib/fetch";
import { WorkExperienceDto } from "@/types/work-experience";

export type CreateWorkExperienceRequest = {
    resumeId: string;
    companyName?: string;
    companyLink?: string;
    title?: string;
    workType?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
};

export const createWorkExperience = async (payload: CreateWorkExperienceRequest) => {
    return FetchClient.post<CreateWorkExperienceRequest, WorkExperienceDto>(`/work-experience`, payload);
};
```

(Similar pattern for education, project, certification)

#### 3.3 Patch Services for Skills and Links

**File:** `services/skills/patch-update-skill.ts`
```typescript
import FetchClient from "@/lib/fetch";
import { SkillDto } from "@/types/skill";

export type PatchUpdateSkillRequest = {
    category?: string;
    skills?: string;
};

export const patchUpdateSkill = async (skillId: string, payload: PatchUpdateSkillRequest) => {
    return FetchClient.patch<PatchUpdateSkillRequest, SkillDto>(`/skill/${skillId}`, payload);
};
```

**File:** `services/links/patch-update-link.ts`
```typescript
import FetchClient from "@/lib/fetch";
import { LinkDto } from "@/types/link";

export type PatchUpdateLinkRequest = {
    name?: string;
    url?: string;
    index?: number;
};

export const patchUpdateLink = async (linkId: string, payload: PatchUpdateLinkRequest) => {
    return FetchClient.patch<PatchUpdateLinkRequest, LinkDto>(`/link/${linkId}`, payload);
};
```

---

### Phase 4: Update Resume Patch Handlers

Update `handlers.ts` to integrate the new services:

```typescript
// Add new imports
import { deleteWorkExperience } from "@/services/work-experience/delete-work-experience";
import { createWorkExperience } from "@/services/work-experience/create-work-experience";
import { deleteEducation } from "@/services/education/delete-education";
import { deleteProject } from "@/services/project/delete-project";
import { deleteCertification } from "@/services/certification/delete-certification";
import { deleteSkill } from "@/services/skills/delete-skill";
import { patchUpdateSkill } from "@/services/skills/patch-update-skill";
import { patchUpdateLink } from "@/services/links/patch-update-link";
import { deleteLink } from "@/services/links/delete-link";

// Update handlers to use the services
// Example for WorkExperience:
case "add":
    const createResponse = await createWorkExperience({
        resumeId,
        ...payload
    });
    if (isCustomError(createResponse)) {
        return { success: false, ... };
    }
    return { success: true, message: "Created work experience" };

case "delete":
    if (!target.id) {
        return { success: false, message: "ID required for delete" };
    }
    const deleteResponse = await deleteWorkExperience(target.id);
    if (isCustomError(deleteResponse)) {
        return { success: false, ... };
    }
    return { success: true, message: "Deleted work experience" };
```

---

### Phase 5: Implementation Checklist

#### Backend Tasks

| Task | File Location | Priority |
|------|---------------|----------|
| Create `Delete/` folder for WorkExperience | `Features/WorkExperience/Delete/` | High |
| Create `Delete/` folder for Education | `Features/Education/Delete/` | High |
| Create `Delete/` folder for Project | `Features/Project/Delete/` | High |
| Create `Delete/` folder for Certification | `Features/Certification/Delete/` | High |
| Create `Delete/` folder for Skills | `Features/Skills/Delete/` | High |
| Create `PatchUpdate/` folder for Skills | `Features/Skills/PatchUpdate/` | Medium |
| Create `PatchUpdate/` folder for Link | `Features/Link/PatchUpdate/` | Medium |
| Add DELETE endpoint to WorkExperienceEndpoints | `WorkExperienceEndpoints.cs` | High |
| Add DELETE endpoint to EducationEndpoints | `EducationEndpoints.cs` | High |
| Add DELETE endpoint to ProjectEndpoints | `ProjectEndpoints.cs` | High |
| Add DELETE endpoint to CertificationEndpoints | `CertificationEndpoints.cs` | High |
| Add DELETE endpoint to SkillEndpoints | `SkillEndpoints.cs` | High |
| Add PATCH endpoint to SkillEndpoints | `SkillEndpoints.cs` | Medium |
| Add PATCH endpoint to LinkEndpoints | `LinkEndpoints.cs` | Medium |

#### Frontend Tasks

| Task | File Location | Priority |
|------|---------------|----------|
| Create delete-work-experience.ts | `services/work-experience/` | High |
| Create delete-education.ts | `services/education/` | High |
| Create delete-project.ts | `services/project/` | High |
| Create delete-certification.ts | `services/certification/` | High |
| Create delete-skill.ts | `services/skills/` | High |
| Create patch-update-skill.ts | `services/skills/` | Medium |
| Create patch-update-link.ts | `services/links/` | Medium |
| Create create-work-experience.ts | `services/work-experience/` | High |
| Update handlers.ts with new imports | `ai/tools/resume-patch/` | High |
| Update handlers.ts add operations | `ai/tools/resume-patch/` | High |
| Update handlers.ts delete operations | `ai/tools/resume-patch/` | High |

---

### Estimated Timeline

| Phase | Description | Duration |
|-------|-------------|----------|
| Phase 1 | Backend DELETE endpoints | 2-3 hours |
| Phase 2 | Backend PATCH endpoints | 1 hour |
| Phase 3 | Frontend services | 1 hour |
| Phase 4 | Handler integration | 1-2 hours |
| Phase 5 | Testing & validation | 2 hours |
| **Total** | | **7-9 hours**

---

## Migration Path

The new `resume_patch` tool coexists with existing tools. To migrate:

1. **Phase 1**: Deploy `resume_patch` alongside existing tools
2. **Phase 2**: Update LLM system prompts to prefer `resume_patch`
3. **Phase 3**: Monitor usage and gather feedback
4. **Phase 4**: Deprecate individual tools (optional)

---

## Conclusion

The Resume Patch System provides a more efficient, consistent, and scalable approach to resume modifications. By consolidating multiple tools into a single interface, we reduce cognitive load on the LLM, decrease token usage, and enable powerful batch operations—all while maintaining backward compatibility with existing services.
