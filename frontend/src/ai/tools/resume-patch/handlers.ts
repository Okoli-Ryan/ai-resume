/**
 * Resume Patch Handlers
 *
 * This module contains handler functions for executing each type of resume patch operation.
 * Each handler maps patch operations to the appropriate service calls.
 */

import { isCustomError } from "@/lib/utils";

// Service imports - Work Experience
import { patchUpdateWorkExperience } from "@/services/work-experience/patch-update-work-experience";
import { createWorkExperience } from "@/services/work-experience/create-work-experience";
import { deleteWorkExperience } from "@/services/work-experience/delete-work-experience";

// Service imports - Education
import { patchUpdateEducation } from "@/services/education/patch-update-education";
import { createEducation } from "@/services/education/create-education";
import { deleteEducation } from "@/services/education/delete-education";

// Service imports - Project
import { patchUpdateProject } from "@/services/project/patch-update-project";
import { createProject } from "@/services/project/create-project";
import { deleteProject } from "@/services/project/delete-project";

// Service imports - Certification
import { patchUpdateCertification } from "@/services/certification/patch-update-certification";
import { createCertification } from "@/services/certification/create-certification";
import { deleteCertification } from "@/services/certification/delete-certification";

// Service imports - Skills
import { createSkill } from "@/services/skills/create-skill";
import { updateSkill } from "@/services/skills/update-skill";
import { deleteSkill } from "@/services/skills/delete-skill";

// Service imports - Bullet Points
import { updateBulletPointsByFieldId } from "@/services/bullet-points/update-bullet-points-by-field";
import type { FieldType } from "@/services/bullet-points/update-bullet-points-by-field";

// Service imports - Links
import { createLink } from "@/services/links/create-link";
import { updateLink } from "@/services/links/update-link";
import { deleteLink } from "@/services/links/delete-link";

// Service imports - Resume
import { patchUpdateSummary } from "@/services/resume/patch-update-summary";
import { patchUpdateResumeInfo } from "@/services/resume/patch-update-resume-info";
import { patchUpdateLinks } from "@/services/resume/patch-update-links";
import { patchUpdateOrder } from "@/services/resume/patch-update-order";

// Type imports
import type {
	WorkExperiencePatchInput,
	ProjectPatchInput,
	EducationPatchInput,
	CertificationPatchInput,
	SkillsPatchInput,
	SummaryPatchInput,
	ResumeInfoPatchInput,
	LinkPatchInput,
	OrderPatchInput,
	ResumePatchInput,
} from "./schemas";

// ============================================================================
// Result Types
// ============================================================================
export type PatchResult = {
	success: boolean;
	section: string;
	operation: string;
	message: string;
	error?: string;
};

// ============================================================================
// Bullet Points By Field Handler
// ============================================================================
export const handleBulletPointsByFieldPatch = async (
	fieldType: FieldType,
	fieldId: string,
	bulletPoints: { text: string }[]
): Promise<PatchResult> => {
	try {
		const response = await updateBulletPointsByFieldId(fieldType, fieldId, {
			bulletPoints: bulletPoints.map((bp) => ({ text: bp.text })),
		});

		if (isCustomError(response)) {
			return {
				success: false,
				section: "bulletPoints",
				operation: "update",
				message: `Failed to update bullet points for ${fieldType} (${fieldId})`,
				error: response.message,
			};
		}

		return {
			success: true,
			section: "bulletPoints",
			operation: "update",
			message: `Successfully updated bullet points for ${fieldType} (${fieldId})`,
		};
	} catch (error) {
		return {
			success: false,
			section: "bulletPoints",
			operation: "update",
			message: "An error occurred while updating bullet points by field",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Work Experience Handler
// ============================================================================
export const handleWorkExperiencePatch = async (
	patch: WorkExperiencePatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, target, payload } = patch;

	try {
		switch (operation) {
			case "add":
				if (!payload) {
					return {
						success: false,
						section: "workExperience",
						operation,
						message: "Payload is required for add operation",
					};
				}

				const createResponse = await createWorkExperience({
					resumeId,
					companyName: payload.companyName,
					companyLink: payload.companyLink,
					title: payload.title,
					workType: payload.workType,
					startDate: payload.startDate,
					endDate: payload.endDate,
					location: payload.location,
					bulletPoints: payload.bulletPoints?.map((bp, index) => ({
						text: bp.text,
						order: bp.order ?? index,
					})),
				});

				if (isCustomError(createResponse)) {
					return {
						success: false,
						section: "workExperience",
						operation,
						message: "Failed to create work experience",
						error: createResponse.message,
					};
				}

				return {
					success: true,
					section: "workExperience",
					operation,
					message: `Successfully created work experience${payload.companyName ? ` at ${payload.companyName}` : ""}`,
				};

			case "update":
				if (!target.id) {
					return {
						success: false,
						section: "workExperience",
						operation,
						message: "ID is required for update operation",
					};
				}
				if (!payload) {
					return {
						success: false,
						section: "workExperience",
						operation,
						message: "Payload is required for update operation",
					};
				}

				const updateResponse = await patchUpdateWorkExperience(target.id, {
					companyName: payload.companyName,
					companyLink: payload.companyLink,
					title: payload.title,
					workType: payload.workType,
					startDate: payload.startDate,
					endDate: payload.endDate,
					location: payload.location,
				});

				if (isCustomError(updateResponse)) {
					return {
						success: false,
						section: "workExperience",
						operation,
						message: "Failed to update work experience",
						error: updateResponse.message,
					};
				}

				if (payload.bulletPoints && payload.bulletPoints.length > 0) {
					const bpResult = await handleBulletPointsByFieldPatch("WorkExperience", target.id, payload.bulletPoints);
					if (!bpResult.success) {
						return {
							success: false,
							section: "workExperience",
							operation,
							message: "Updated work experience but failed to update bullet points",
							error: bpResult.error,
						};
					}
				}

				return {
					success: true,
					section: "workExperience",
					operation,
					message: `Successfully updated work experience${payload.companyName ? ` at ${payload.companyName}` : ""}`,
				};

			case "delete":
				if (!target.id) {
					return {
						success: false,
						section: "workExperience",
						operation,
						message: "ID is required for delete operation",
					};
				}

				const deleteResponse = await deleteWorkExperience(target.id);

				if (isCustomError(deleteResponse)) {
					return {
						success: false,
						section: "workExperience",
						operation,
						message: "Failed to delete work experience",
						error: deleteResponse.message,
					};
				}

				return {
					success: true,
					section: "workExperience",
					operation,
					message: "Successfully deleted work experience",
				};

			default:
				return {
					success: false,
					section: "workExperience",
					operation,
					message: `Unknown operation: ${operation}`,
				};
		}
	} catch (error) {
		return {
			success: false,
			section: "workExperience",
			operation,
			message: "An error occurred while processing work experience patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Project Handler
// ============================================================================
export const handleProjectPatch = async (
	patch: ProjectPatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, target, payload } = patch;

	try {
		switch (operation) {
			case "add":
				if (!payload) {
					return {
						success: false,
						section: "project",
						operation,
						message: "Payload is required for add operation",
					};
				}

				const createResponse = await createProject({
					resumeId,
					name: payload.name,
					link: payload.link,
					bulletPoints: payload.bulletPoints?.map((bp, index) => ({
						text: bp.text,
						order: bp.order ?? index,
					})),
				});

				if (isCustomError(createResponse)) {
					return {
						success: false,
						section: "project",
						operation,
						message: "Failed to create project",
						error: createResponse.message,
					};
				}

				return {
					success: true,
					section: "project",
					operation,
					message: `Successfully created project${payload.name ? ` "${payload.name}"` : ""}`,
				};

			case "update":
				if (!target.id) {
					return {
						success: false,
						section: "project",
						operation,
						message: "ID is required for update operation",
					};
				}
				if (!payload) {
					return {
						success: false,
						section: "project",
						operation,
						message: "Payload is required for update operation",
					};
				}

				const updateResponse = await patchUpdateProject(target.id, {
					projectName: payload.name,
					projectUrl: payload.link,
				});

				if (isCustomError(updateResponse)) {
					return {
						success: false,
						section: "project",
						operation,
						message: "Failed to update project",
						error: updateResponse.message,
					};
				}

				if (payload.bulletPoints && payload.bulletPoints.length > 0) {
					const bpResult = await handleBulletPointsByFieldPatch("Project", target.id, payload.bulletPoints);
					if (!bpResult.success) {
						return {
							success: false,
							section: "project",
							operation,
							message: "Updated project but failed to update bullet points",
							error: bpResult.error,
						};
					}
				}

				return {
					success: true,
					section: "project",
					operation,
					message: `Successfully updated project${payload.name ? ` "${payload.name}"` : ""}`,
				};

			case "delete":
				if (!target.id) {
					return {
						success: false,
						section: "project",
						operation,
						message: "ID is required for delete operation",
					};
				}

				const deleteResponse = await deleteProject(target.id);

				if (isCustomError(deleteResponse)) {
					return {
						success: false,
						section: "project",
						operation,
						message: "Failed to delete project",
						error: deleteResponse.message,
					};
				}

				return {
					success: true,
					section: "project",
					operation,
					message: "Successfully deleted project",
				};

			default:
				return {
					success: false,
					section: "project",
					operation,
					message: `Unknown operation: ${operation}`,
				};
		}
	} catch (error) {
		return {
			success: false,
			section: "project",
			operation,
			message: "An error occurred while processing project patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Education Handler
// ============================================================================
export const handleEducationPatch = async (
	patch: EducationPatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, target, payload } = patch;

	try {
		switch (operation) {
			case "add":
				if (!payload) {
					return {
						success: false,
						section: "education",
						operation,
						message: "Payload is required for add operation",
					};
				}

				const createResponse = await createEducation({
					resumeId,
					schoolName: payload.schoolName,
					degree: payload.degree,
					fieldOfStudy: payload.fieldOfStudy,
					location: payload.location,
					startDate: payload.startDate,
					endDate: payload.endDate,
					bulletPoints: payload.bulletPoints?.map((bp, index) => ({
						text: bp.text,
						order: bp.order ?? index,
					})),
				});

				if (isCustomError(createResponse)) {
					return {
						success: false,
						section: "education",
						operation,
						message: "Failed to create education",
						error: createResponse.message,
					};
				}

				return {
					success: true,
					section: "education",
					operation,
					message: `Successfully created education${payload.schoolName ? ` at ${payload.schoolName}` : ""}`,
				};

			case "update":
				if (!target.id) {
					return {
						success: false,
						section: "education",
						operation,
						message: "ID is required for update operation",
					};
				}
				if (!payload) {
					return {
						success: false,
						section: "education",
						operation,
						message: "Payload is required for update operation",
					};
				}

				const updateResponse = await patchUpdateEducation(target.id, {
					schoolName: payload.schoolName,
					degree: payload.degree,
					fieldOfStudy: payload.fieldOfStudy,
					location: payload.location,
					startDate: payload.startDate,
					endDate: payload.endDate,
				});

				if (isCustomError(updateResponse)) {
					return {
						success: false,
						section: "education",
						operation,
						message: "Failed to update education",
						error: updateResponse.message,
					};
				}

				if (payload.bulletPoints && payload.bulletPoints.length > 0) {
					const bpResult = await handleBulletPointsByFieldPatch("Education", target.id, payload.bulletPoints);
					if (!bpResult.success) {
						return {
							success: false,
							section: "education",
							operation,
							message: "Updated education but failed to update bullet points",
							error: bpResult.error,
						};
					}
				}

				return {
					success: true,
					section: "education",
					operation,
					message: `Successfully updated education${payload.schoolName ? ` at ${payload.schoolName}` : ""}`,
				};

			case "delete":
				if (!target.id) {
					return {
						success: false,
						section: "education",
						operation,
						message: "ID is required for delete operation",
					};
				}

				const deleteResponse = await deleteEducation(target.id);

				if (isCustomError(deleteResponse)) {
					return {
						success: false,
						section: "education",
						operation,
						message: "Failed to delete education",
						error: deleteResponse.message,
					};
				}

				return {
					success: true,
					section: "education",
					operation,
					message: "Successfully deleted education",
				};

			default:
				return {
					success: false,
					section: "education",
					operation,
					message: `Unknown operation: ${operation}`,
				};
		}
	} catch (error) {
		return {
			success: false,
			section: "education",
			operation,
			message: "An error occurred while processing education patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Certification Handler
// ============================================================================
export const handleCertificationPatch = async (
	patch: CertificationPatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, target, payload } = patch;

	try {
		switch (operation) {
			case "add":
				if (!payload) {
					return {
						success: false,
						section: "certification",
						operation,
						message: "Payload is required for add operation",
					};
				}

				const createResponse = await createCertification({
					resumeId,
					certificationName: payload.certificationName,
					certificateLink: payload.certificateLink,
					dateAttained: payload.dateAttained,
					bulletPoints: payload.bulletPoints?.map((bp, index) => ({
						text: bp.text,
						order: bp.order ?? index,
					})),
				});

				if (isCustomError(createResponse)) {
					return {
						success: false,
						section: "certification",
						operation,
						message: "Failed to create certification",
						error: createResponse.message,
					};
				}

				return {
					success: true,
					section: "certification",
					operation,
					message: `Successfully created certification${payload.certificationName ? ` "${payload.certificationName}"` : ""}`,
				};

			case "update":
				if (!target.id) {
					return {
						success: false,
						section: "certification",
						operation,
						message: "ID is required for update operation",
					};
				}
				if (!payload) {
					return {
						success: false,
						section: "certification",
						operation,
						message: "Payload is required for update operation",
					};
				}

				const updateResponse = await patchUpdateCertification(target.id, {
					certificationName: payload.certificationName,
					certificateLink: payload.certificateLink,
					dateAttained: payload.dateAttained,
				});

				if (isCustomError(updateResponse)) {
					return {
						success: false,
						section: "certification",
						operation,
						message: "Failed to update certification",
						error: updateResponse.message,
					};
				}

				return {
					success: true,
					section: "certification",
					operation,
					message: `Successfully updated certification${payload.certificationName ? ` "${payload.certificationName}"` : ""}`,
				};

			case "delete":
				if (!target.id) {
					return {
						success: false,
						section: "certification",
						operation,
						message: "ID is required for delete operation",
					};
				}

				const deleteResponse = await deleteCertification(target.id);

				if (isCustomError(deleteResponse)) {
					return {
						success: false,
						section: "certification",
						operation,
						message: "Failed to delete certification",
						error: deleteResponse.message,
					};
				}

				return {
					success: true,
					section: "certification",
					operation,
					message: "Successfully deleted certification",
				};

			default:
				return {
					success: false,
					section: "certification",
					operation,
					message: `Unknown operation: ${operation}`,
				};
		}
	} catch (error) {
		return {
			success: false,
			section: "certification",
			operation,
			message: "An error occurred while processing certification patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Skills Handler
// ============================================================================
export const handleSkillsPatch = async (
	patch: SkillsPatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, target, payload } = patch;

	try {
		switch (operation) {
			case "add":
				if (!payload) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "Payload is required for add operation",
					};
				}
				if (!payload.group || !payload.skills) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "Group and skills are required for add operation",
					};
				}

				const createResponse = await createSkill({
					resumeId,
					group: payload.group,
					skills: payload.skills,
				});

				if (isCustomError(createResponse)) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "Failed to create skill category",
						error: createResponse.message,
					};
				}

				return {
					success: true,
					section: "skills",
					operation,
					message: `Successfully created skill category "${payload.group}"`,
				};

			case "update":
				if (!target.id) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "ID is required for update operation",
					};
				}
				if (!payload) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "Payload is required for update operation",
					};
				}
				if (!payload.group || !payload.skills) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "Group (category) and skills are required for update operation",
					};
				}

				const updateResponse = await updateSkill(target.id, {
					category: payload.group,
					skills: payload.skills,
				});

				if (isCustomError(updateResponse)) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "Failed to update skill category",
						error: updateResponse.message,
					};
				}

				return {
					success: true,
					section: "skills",
					operation,
					message: `Successfully updated skill category "${payload.group}"`,
				};

			case "delete":
				if (!target.id) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "ID is required for delete operation",
					};
				}

				const deleteResponse = await deleteSkill(target.id);

				if (isCustomError(deleteResponse)) {
					return {
						success: false,
						section: "skills",
						operation,
						message: "Failed to delete skill category",
						error: deleteResponse.message,
					};
				}

				return {
					success: true,
					section: "skills",
					operation,
					message: "Successfully deleted skill category",
				};

			default:
				return {
					success: false,
					section: "skills",
					operation,
					message: `Unknown operation: ${operation}`,
				};
		}
	} catch (error) {
		return {
			success: false,
			section: "skills",
			operation,
			message: "An error occurred while processing skills patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Summary Handler
// ============================================================================
export const handleSummaryPatch = async (
	patch: SummaryPatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, payload } = patch;

	try {
		const response = await patchUpdateSummary({ summary: payload.summary }, resumeId);

		if (isCustomError(response)) {
			return {
				success: false,
				section: "summary",
				operation,
				message: "Failed to update summary",
				error: response.message,
			};
		}

		return {
			success: true,
			section: "summary",
			operation,
			message: "Successfully updated summary",
		};
	} catch (error) {
		return {
			success: false,
			section: "summary",
			operation,
			message: "An error occurred while processing summary patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Resume Info Handler
// ============================================================================
export const handleResumeInfoPatch = async (
	patch: ResumeInfoPatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, payload } = patch;

	try {
		if (!payload || Object.keys(payload).length === 0) {
			return {
				success: false,
				section: "resumeInfo",
				operation,
				message: "No fields provided to update",
			};
		}

		// Handle social links separately if provided
		const socialLinks = {
			linkedinUrl: payload.linkedinUrl,
			githubUrl: payload.githubUrl,
			portfolioUrl: payload.portfolioUrl,
		};
		const hasSocialLinks = Object.values(socialLinks).some((v) => v !== undefined);

		// Handle other resume info
		const resumeInfo = {
			userName: payload.userName,
			resumeName: payload.resumeName,
			email: payload.email,
			tags: payload.tags,
			role: payload.role,
			address: payload.address,
			phoneNumber: payload.phoneNumber,
		};
		const hasResumeInfo = Object.values(resumeInfo).some((v) => v !== undefined);

		const results: string[] = [];

		if (hasResumeInfo) {
			const infoResponse = await patchUpdateResumeInfo(resumeInfo, resumeId);
			if (isCustomError(infoResponse)) {
				return {
					success: false,
					section: "resumeInfo",
					operation,
					message: "Failed to update resume info",
					error: infoResponse.message,
				};
			}
			results.push("basic info");
		}

		if (hasSocialLinks) {
			const linksResponse = await patchUpdateLinks(socialLinks, resumeId);
			if (isCustomError(linksResponse)) {
				return {
					success: false,
					section: "resumeInfo",
					operation,
					message: "Failed to update social links",
					error: linksResponse.message,
				};
			}
			results.push("social links");
		}

		return {
			success: true,
			section: "resumeInfo",
			operation,
			message: `Successfully updated ${results.join(" and ")}`,
		};
	} catch (error) {
		return {
			success: false,
			section: "resumeInfo",
			operation,
			message: "An error occurred while processing resume info patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Links Handler
// ============================================================================
export const handleLinkPatch = async (
	patch: LinkPatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, target, payload } = patch;

	try {
		switch (operation) {
			case "add":
				if (!payload) {
					return {
						success: false,
						section: "links",
						operation,
						message: "Payload is required for add operation",
					};
				}
				if (!payload.name || !payload.url) {
					return {
						success: false,
						section: "links",
						operation,
						message: "Name and URL are required for add operation",
					};
				}

				const createResponse = await createLink({
					resumeId,
					linkName: payload.name,
					url: payload.url,
				});

				if (isCustomError(createResponse)) {
					return {
						success: false,
						section: "links",
						operation,
						message: "Failed to create link",
						error: createResponse.message,
					};
				}

				return {
					success: true,
					section: "links",
					operation,
					message: `Successfully created link "${payload.name}"`,
				};

			case "update":
				if (!target.id) {
					return {
						success: false,
						section: "links",
						operation,
						message: "ID is required for update operation",
					};
				}
				if (!payload) {
					return {
						success: false,
						section: "links",
						operation,
						message: "Payload is required for update operation",
					};
				}
				if (!payload.name || !payload.url) {
					return {
						success: false,
						section: "links",
						operation,
						message: "Name and URL are required for update operation",
					};
				}

				const updateResponse = await updateLink(target.id, {
					linkName: payload.name,
					url: payload.url,
				});

				if (isCustomError(updateResponse)) {
					return {
						success: false,
						section: "links",
						operation,
						message: "Failed to update link",
						error: updateResponse.message,
					};
				}

				return {
					success: true,
					section: "links",
					operation,
					message: `Successfully updated link "${payload.name}"`,
				};

			case "delete":
				if (!target.id) {
					return {
						success: false,
						section: "links",
						operation,
						message: "ID is required for delete operation",
					};
				}

				const deleteResponse = await deleteLink(target.id);

				if (isCustomError(deleteResponse)) {
					return {
						success: false,
						section: "links",
						operation,
						message: "Failed to delete link",
						error: deleteResponse.message,
					};
				}

				return {
					success: true,
					section: "links",
					operation,
					message: "Successfully deleted link",
				};

			default:
				return {
					success: false,
					section: "links",
					operation,
					message: `Unknown operation: ${operation}`,
				};
		}
	} catch (error) {
		return {
			success: false,
			section: "links",
			operation,
			message: "An error occurred while processing link patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Order Handler
// ============================================================================
export const handleOrderPatch = async (
	patch: OrderPatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const { operation, payload } = patch;

	try {
		const response = await patchUpdateOrder({ order: payload.order }, resumeId);

		if (isCustomError(response)) {
			return {
				success: false,
				section: "order",
				operation,
				message: "Failed to update section order",
				error: response.message,
			};
		}

		return {
			success: true,
			section: "order",
			operation,
			message: `Successfully updated section order to: ${payload.order}`,
		};
	} catch (error) {
		return {
			success: false,
			section: "order",
			operation,
			message: "An error occurred while processing order patch",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// ============================================================================
// Main Patch Router
// ============================================================================
export const executePatch = async (
	patch: ResumePatchInput,
	resumeId: string
): Promise<PatchResult> => {
	const section = patch.target.section;

	switch (section) {
		case "workExperience":
			return handleWorkExperiencePatch(patch as WorkExperiencePatchInput, resumeId);
		case "project":
			return handleProjectPatch(patch as ProjectPatchInput, resumeId);
		case "education":
			return handleEducationPatch(patch as EducationPatchInput, resumeId);
		case "certification":
			return handleCertificationPatch(patch as CertificationPatchInput, resumeId);
		case "skills":
			return handleSkillsPatch(patch as SkillsPatchInput, resumeId);
		case "summary":
			return handleSummaryPatch(patch as SummaryPatchInput, resumeId);
		case "resumeInfo":
			return handleResumeInfoPatch(patch as ResumeInfoPatchInput, resumeId);
		case "links":
			return handleLinkPatch(patch as LinkPatchInput, resumeId);
		case "order":
			return handleOrderPatch(patch as OrderPatchInput, resumeId);
		default:
			return {
				success: false,
				section: "unknown",
				operation: "unknown",
				message: `Unknown section: ${section}`,
			};
	}
};

// ============================================================================
// Batch Patch Executor
// ============================================================================
export const executePatchBatch = async (
	patches: ResumePatchInput[],
	resumeId: string
): Promise<{
	success: boolean;
	results: PatchResult[];
	summary: string;
}> => {
	const results: PatchResult[] = [];

	for (const patch of patches) {
		const result = await executePatch(patch, resumeId);
		results.push(result);
	}

	const successCount = results.filter((r) => r.success).length;
	const failureCount = results.filter((r) => !r.success).length;

	return {
		success: failureCount === 0,
		results,
		summary: `Processed ${patches.length} patches: ${successCount} succeeded, ${failureCount} failed`,
	};
};
