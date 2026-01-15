# Resume Endpoints Documentation for MCP Server Integration

This document provides comprehensive documentation for the new resume endpoints designed to enable seamless integration with MCP (Model Context Protocol) servers. These endpoints support CRUD operations, resume tailoring, section management, and bullet point updates.

## Table of Contents
- [Overview](#overview)
- [Endpoint Categories](#endpoint-categories)
- [PATCH vs PUT](#patch-vs-put)
- [Detailed Endpoint Documentation](#detailed-endpoint-documentation)
- [MCP Server Integration Examples](#mcp-server-integration-examples)

---

## Overview

The Resume API endpoints follow RESTful principles and are designed for:
- **Granular updates** using PATCH operations
- **Section-specific queries** for targeted data retrieval
- **Role-based tailoring** for customizing resumes to specific job roles
- **Flexible bullet point management** across all resume sections

All endpoints require authentication via JWT bearer token and are prefixed with `/api/v1/resume`.

---

## Endpoint Categories

### 1. Core Resume Operations
- PATCH `/api/v1/resume/{resumeId}` - Partial update
- PUT `/api/v1/resume/{resumeId}` - Full update (existing)
- GET `/api/v1/resume/{resumeId}` - Get full resume (existing)

### 2. Section Management
- GET `/api/v1/resume/{resumeId}/sections` - Get all sections
- GET `/api/v1/resume/{resumeId}/sections/projects` - Get projects section
- GET `/api/v1/resume/{resumeId}/sections/education` - Get education section
- GET `/api/v1/resume/{resumeId}/sections/work-experience` - Get work experience section
- GET `/api/v1/resume/{resumeId}/sections/skills` - Get skills section
- GET `/api/v1/resume/{resumeId}/sections/certifications` - Get certifications section

### 3. Tailoring & Organization
- GET `/api/v1/resume/{resumeId}/tailor?role={role}` - Get tailoring suggestions
- PATCH `/api/v1/resume/{resumeId}/reorder` - Reorder sections
- PATCH `/api/v1/resume/{resumeId}/bullets` - Update bullet points by role

---

## PATCH vs PUT

### When to Use PATCH
- **Partial updates**: Only modify specific fields without affecting others
- **Incremental changes**: Update one or a few properties
- **Null safety**: Fields not provided in the request remain unchanged
- **Example use cases**:
  - Update only the resume summary
  - Change favorite status
  - Modify section order
  - Update bullet points for a specific role

### When to Use PUT
- **Full replacement**: Replace entire resource with new data
- **Complete updates**: All fields are provided
- **Example use cases**:
  - Bulk update after AI generation
  - Complete resume overhaul

### Helper Function for PATCH Operations
The codebase includes `PatchHelper` utility class that manages null checks efficiently:

```csharp
// Apply patch only if value is provided (not null)
resume.ResumeName = PatchHelper.ApplyPatch(resume.ResumeName, request.ResumeName);
```

This eliminates repetitive if-statements throughout the codebase.

---

## Detailed Endpoint Documentation

### 1. PATCH Resume (Partial Update)

**Endpoint**: `PATCH /api/v1/resume/{resumeId}`

**Description**: Partially update a resume. Only provided fields will be updated; null fields are ignored.

**Request Body**:
```json
{
  "userName": "John Doe",
  "resumeName": "Software Engineer Resume",
  "email": "john@example.com",
  "summary": "Experienced software engineer...",
  "role": "Senior Backend Engineer",
  "order": "WorkExperience,Skills,Projects,Education",
  "address": "San Francisco, CA",
  "phoneNumber": "+1-555-0123",
  "tags": "backend,python,go",
  "isFavourite": true,
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "githubUrl": "https://github.com/johndoe",
  "portfolioUrl": "https://johndoe.dev"
}
```

**Response**:
```json
{
  "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "userName": "John Doe",
  "resumeName": "Software Engineer Resume",
  "email": "john@example.com",
  "summary": "Experienced software engineer...",
  "role": "Senior Backend Engineer",
  "order": "WorkExperience,Skills,Projects,Education",
  ...
}
```

**MCP Server Use Case**:
```
User: "Update my resume summary to focus on backend development"
MCP Tool Call:
  - Endpoint: PATCH /api/v1/resume/{resumeId}
  - Body: { "summary": "Backend engineer with 7+ years experience..." }
```

---

### 2. Get All Sections

**Endpoint**: `GET /api/v1/resume/{resumeId}/sections`

**Description**: Retrieve all sections of a resume grouped by type.

**Response**:
```json
{
  "projects": [
    {
      "id": "...",
      "projectName": "E-commerce Platform",
      "description": "Built scalable e-commerce solution",
      "bulletPoints": [...]
    }
  ],
  "education": [...],
  "workExperience": [...],
  "skills": [...],
  "links": [...],
  "certifications": [...]
}
```

**MCP Server Use Case**:
```
User: "Show me all sections in my resume"
MCP Tool Call:
  - Endpoint: GET /api/v1/resume/{resumeId}/sections
```

---

### 3. Get Individual Section

**Endpoints**:
- `GET /api/v1/resume/{resumeId}/sections/projects`
- `GET /api/v1/resume/{resumeId}/sections/education`
- `GET /api/v1/resume/{resumeId}/sections/work-experience`
- `GET /api/v1/resume/{resumeId}/sections/skills`
- `GET /api/v1/resume/{resumeId}/sections/certifications`

**Description**: Retrieve a specific section from a resume.

**Response**:
```json
{
  "sectionType": "Projects",
  "items": [
    {
      "id": "...",
      "projectName": "E-commerce Platform",
      "description": "Built scalable e-commerce solution",
      ...
    }
  ]
}
```

**MCP Server Use Case**:
```
User: "Show me my work experience section"
MCP Tool Call:
  - Endpoint: GET /api/v1/resume/{resumeId}/sections/work-experience
```

---

### 4. Tailor Resume to Role

**Endpoint**: `GET /api/v1/resume/{resumeId}/tailor?role={targetRole}`

**Description**: Get AI-powered suggestions for tailoring a resume to a specific job role. Returns recommended section ordering, section priorities, and guidance.

**Query Parameters**:
- `role` (required): Target role (e.g., "Frontend Developer", "Data Scientist", "DevOps Engineer")

**Response**:
```json
{
  "resumeId": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "targetRole": "Frontend Developer",
  "suggestedOrder": "WorkExperience,Projects,Skills,Education,Certifications",
  "suggestedSummary": "Consider emphasizing your Frontend Developer experience, relevant technical skills, and measurable achievements...",
  "recommendedSections": [
    "WorkExperience",
    "Skills",
    "Projects",
    "Education"
  ],
  "sectionPriorities": {
    "WorkExperience": "Priority 1",
    "Projects": "Priority 2",
    "Skills": "Priority 3",
    "Education": "Priority 4",
    "Certifications": "Priority 5"
  }
}
```

**Role-Based Templates**:
- **Frontend/Mobile/UI**: Emphasizes Projects and WorkExperience
- **Backend/Fullstack**: Prioritizes WorkExperience, Skills, Projects
- **Data Scientist/ML**: Education and Skills take higher priority
- **DevOps/SRE**: Certifications and Skills are emphasized

**MCP Server Use Case**:
```
User: "Tailor my resume for a Frontend Engineer role"
MCP Tool Call:
  1. GET /api/v1/resume/{resumeId}/tailor?role=Frontend%20Engineer
  2. Review suggestions
  3. PATCH /api/v1/resume/{resumeId}/reorder with suggested order
```

---

### 5. Reorder Resume Sections

**Endpoint**: `PATCH /api/v1/resume/{resumeId}/reorder`

**Description**: Update the order in which sections appear in the resume.

**Request Body**:
```json
{
  "order": "WorkExperience,Skills,Projects,Education,Certifications"
}
```

**Valid Section Names**:
- WorkExperience
- Education
- Skills
- Projects
- Certifications
- Links

**Response**:
```json
{
  "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "order": "WorkExperience,Skills,Projects,Education,Certifications",
  ...
}
```

**MCP Server Use Case**:
```
User: "Put my work experience first, then skills"
MCP Tool Call:
  - Endpoint: PATCH /api/v1/resume/{resumeId}/reorder
  - Body: { "order": "WorkExperience,Skills,Projects,Education,Certifications" }
```

---

### 6. Update Bullet Points by Role

**Endpoint**: `PATCH /api/v1/resume/{resumeId}/bullets`

**Description**: Update multiple bullet points across the resume, typically tailored for a specific role. Useful for role-specific customization.

**Request Body**:
```json
{
  "targetRole": "Data Scientist",
  "bulletPoints": [
    {
      "bulletPointId": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
      "text": "Developed machine learning models achieving 95% accuracy"
    },
    {
      "bulletPointId": "01ARZ3NDEKTSV4RRFFQ69G5FAW",
      "text": "Led data pipeline optimization reducing processing time by 60%"
    }
  ]
}
```

**Response**:
```json
{
  "resumeId": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "targetRole": "Data Scientist",
  "updatedBulletPoints": [
    {
      "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
      "text": "Developed machine learning models achieving 95% accuracy",
      "order": 1,
      ...
    }
  ],
  "totalUpdated": 2
}
```

**MCP Server Use Case**:
```
User: "Update my bullet points to emphasize data science skills"
MCP Tool Call:
  1. GET /api/v1/resume/{resumeId}/sections/work-experience
  2. Identify relevant bullet points
  3. PATCH /api/v1/resume/{resumeId}/bullets with updated text
```

---

## MCP Server Integration Examples

### Example 1: Complete Resume Tailoring Workflow

```
User: "Tailor my resume for a Data Scientist position"

MCP Server Actions:
1. GET /api/v1/resume/{resumeId}/tailor?role=Data%20Scientist
   - Receive suggestions and recommended order
   
2. PATCH /api/v1/resume/{resumeId}/reorder
   - Body: { "order": "WorkExperience,Education,Skills,Projects,Certifications" }
   
3. GET /api/v1/resume/{resumeId}/sections/work-experience
   - Retrieve current work experience bullet points
   
4. PATCH /api/v1/resume/{resumeId}/bullets
   - Update bullets with data science emphasis
   
5. PATCH /api/v1/resume/{resumeId}
   - Update summary to focus on data science experience
```

### Example 2: Quick Section Update

```
User: "Update only my summary"

MCP Server Actions:
1. PATCH /api/v1/resume/{resumeId}
   - Body: { "summary": "New summary text..." }
```

### Example 3: Section Retrieval

```
User: "What projects are on my resume?"

MCP Server Actions:
1. GET /api/v1/resume/{resumeId}/sections/projects
   - Display projects to user
```

### Example 4: Rearrange for Best Practices

```
User: "Rearrange my sections to follow best practices for software engineers"

MCP Server Actions:
1. GET /api/v1/resume/{resumeId}/tailor?role=Software%20Engineer
   - Get recommended order
   
2. PATCH /api/v1/resume/{resumeId}/reorder
   - Apply suggested order
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- **200 OK**: Successful request
- **400 Bad Request**: Invalid input (e.g., invalid section names)
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resume not found
- **500 Internal Server Error**: Server error

**Error Response Format**:
```json
{
  "error": "Invalid section names: InvalidSection. Valid sections: WorkExperience, Education, Skills, Projects, Certifications, Links"
}
```

---

## Authentication

All endpoints require authentication using JWT bearer tokens:

```http
Authorization: Bearer <jwt_token>
```

The authenticated user can only access and modify their own resumes.

---

## Best Practices for MCP Integration

1. **Use PATCH for incremental updates**: Prefer PATCH over PUT for updating specific fields
2. **Validate before updating**: Use GET endpoints to retrieve current state before making updates
3. **Batch updates**: Use `/bullets` endpoint to update multiple bullet points at once
4. **Role-based tailoring**: Always call `/tailor` endpoint before making role-specific changes
5. **Error handling**: Implement retry logic for transient failures
6. **Caching**: Cache section data to reduce API calls during multi-step operations

---

## Migration Notes

### For Existing Code
- Existing PUT endpoint at `/api/v1/resume/{resumeId}` continues to work as before
- New PATCH endpoint is additive and doesn't break existing functionality
- All new endpoints are backward compatible

### For New Integrations
- Prefer PATCH for updates when possible
- Use section-specific GET endpoints for targeted queries
- Leverage tailor endpoint for role-based optimizations

---

## Support

For issues or questions:
- Review the implementation in `/backend/Resume-builder/Features/Resume/`
- Check handler implementations for detailed logic
- Refer to existing endpoint patterns in other feature folders

---

Last Updated: 2026-01-15
