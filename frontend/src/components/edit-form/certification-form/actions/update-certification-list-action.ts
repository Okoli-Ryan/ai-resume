"use server";

import { CertificationDto } from "@/types/certification";

export async function updateCertificationListAction(certifications: CertificationDto[], resumeId: string) {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/resume/${resumeId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(certifications),
			cache: "no-store",
		});

		if (!response.ok) {
			const errorData = await response.json();
			return {
				success: false,
				message: errorData.message || "Failed to update certifications",
			};
		}

		const data = await response.json();

		return {
			success: true,
			message: "Certifications updated successfully",
			data: data.data,
		};
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : "An unexpected error occurred",
		};
	}
}
