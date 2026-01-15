# Resume API Documentation

This directory contains comprehensive documentation for the Resume API endpoints designed for MCP (Model Context Protocol) server integration.

## Documentation Files

### 1. [resume-endpoints-mcp.md](./resume-endpoints-mcp.md)
Complete reference documentation for all resume endpoints including:
- Overview and architecture
- PATCH vs PUT usage guidelines
- Detailed endpoint specifications
- MCP integration patterns
- Error handling
- Best practices

**Use this for:**
- Understanding endpoint capabilities
- Learning about PATCH operations
- MCP server integration planning
- Architecture decisions

### 2. [resume-api-examples.http](./resume-api-examples.http)
Practical HTTP request examples for all endpoints including:
- Complete HTTP requests with headers
- Request/response body examples
- cURL command examples
- Multi-step workflow examples
- Error scenarios

**Use this for:**
- Quick reference during development
- Testing endpoints with REST clients
- Copy-paste ready examples
- Learning request/response formats

## Quick Start

### For MCP Server Developers
1. Read [resume-endpoints-mcp.md](./resume-endpoints-mcp.md) sections:
   - "MCP Server Integration Examples"
   - "Best Practices for MCP Integration"
2. Use [resume-api-examples.http](./resume-api-examples.http) for testing

### For API Consumers
1. Review endpoint categories in [resume-endpoints-mcp.md](./resume-endpoints-mcp.md)
2. Copy examples from [resume-api-examples.http](./resume-api-examples.http)
3. Adapt to your use case

## Endpoint Categories

### Core Operations
- `GET /api/v1/resume/{resumeId}` - Get full resume
- `POST /api/v1/resume` - Create resume
- `PUT /api/v1/resume/{resumeId}` - Full update
- `PATCH /api/v1/resume/{resumeId}` - Partial update ⭐ NEW

### Section Management ⭐ NEW
- `GET /api/v1/resume/{resumeId}/sections` - Get all sections
- `GET /api/v1/resume/{resumeId}/sections/{type}` - Get specific section
  - Types: `projects`, `education`, `work-experience`, `skills`, `certifications`

### Tailoring & Organization ⭐ NEW
- `GET /api/v1/resume/{resumeId}/tailor?role={role}` - Get tailoring suggestions
- `PATCH /api/v1/resume/{resumeId}/reorder` - Reorder sections
- `PATCH /api/v1/resume/{resumeId}/bullets` - Update bullet points by role

## Key Features

### 🔧 PATCH Support
Granular updates using PATCH operations with built-in null handling via `PatchHelper` utility.

### 🎯 Role-Based Tailoring
AI-powered suggestions for optimizing resumes for specific job roles with automatic section reordering.

### 📦 Section-Specific Queries
Retrieve individual sections without fetching the entire resume for better performance.

### 🔄 Bulk Bullet Updates
Update multiple bullet points across sections in a single request.

## Implementation Details

All endpoints are implemented using:
- **.NET 9.0** with minimal APIs
- **Carter** for routing
- **Entity Framework Core** for data access
- **Vertical slice architecture** for maintainability
- **JWT authentication** for security

Code location: `/backend/Resume-builder/Features/Resume/`

## Testing

Use REST clients like:
- **VS Code REST Client** - Open `.http` files directly
- **Postman** - Import examples
- **cURL** - Use provided command examples
- **Swagger UI** - Available in development mode at `/swagger`

## Authentication

All endpoints require JWT bearer token:
```http
Authorization: Bearer <your_jwt_token>
```

Users can only access their own resumes.

## Support

For implementation details:
- Review source code in `/backend/Resume-builder/Features/Resume/`
- Check handler implementations for business logic
- Refer to existing patterns in other feature folders

---

Last Updated: 2026-01-15
