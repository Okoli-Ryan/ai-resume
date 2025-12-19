"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Routes } from "@/lib/routes";
import { getRelativeTime } from "@/lib/utils";
import { TResume } from "@/types/resume";
import { format } from "date-fns";
import Link from "next/link";
import ResumeTags from "./resume-tags";
import EmptyState from "@/components/empty-state";
import DuplicateResumeButton from "./duplicate-resume-button";
import DownloadResumeButton from "./download-resume-button";
import EditResumeButton from "./edit-resume-button";

interface ResumeTableProps {
	resumes: Partial<TResume>[];
	isLoading: boolean;
	// searchTerm: string;
}

const formatDate = (date: Date | string) => {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return format(dateObj, "MMM dd, yyyy");
};

export default function ResumeTable({ resumes, isLoading }: ResumeTableProps) {
	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
						<p className="mt-4 text-gray-500">Loading resumes...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="overflow-x-auto">
			<CardContent className="p-0">
				<div className="max-w-full">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="cursor-pointer hover:bg-gray-50 transition-colors">
									<div className="flex items-center space-x-1">
										<span>Resume Name</span>
									</div>
								</TableHead>
								<TableHead className="cursor-pointer hover:bg-gray-50 transition-colors">
									<div className="flex items-center space-x-1">
										<span>Role</span>
									</div>
								</TableHead>
								<TableHead className="cursor-pointer hover:bg-gray-50 transition-colors">
									<div className="flex items-center space-x-1">
										<span>Tags</span>
									</div>
								</TableHead>

								<TableHead className="cursor-pointer hover:bg-gray-50 transition-colors  whitespace-nowrap">
									<div className="flex items-center space-x-1">
										<span>Last Modified</span>
									</div>
								</TableHead>
								<TableHead className="cursor-pointer hover:bg-gray-50 transition-colors  whitespace-nowrap">
									<div className="flex items-center space-x-1">
										<span>Created</span>
									</div>
								</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{resumes.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="p-0">
										<EmptyState title="No resumes found" />
									</TableCell>
								</TableRow>
							) : (
								resumes.map((resume) => (
									<TableRow key={resume.id} className="hover:bg-gray-50 transition-colors">
										<TableCell className=" max-w-60">
											<div className="flex items-center">
												<Link href={Routes.editResume(resume.id!)}>
													<div className="text-sm font-medium text-gray-900 hover:text-primary transition-colors duration-200 hover:underline">
														{resume.resumeName}
													</div>
												</Link>
											</div>
										</TableCell>
										<TableCell className="text-sm text-gray-900">{resume.role}</TableCell>
										<TableCell className="text-sm text-gray-900">
											<ResumeTags tags={resume.tags} />
										</TableCell>
										<TableCell className="text-sm text-gray-900  whitespace-nowrap">{getRelativeTime(resume.updatedAt!)}</TableCell>
										<TableCell className="text-sm text-gray-900  whitespace-nowrap">{formatDate(resume.createdAt!)}</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<EditResumeButton resumeId={resume.id!} />
												<DuplicateResumeButton resumeId={resume.id!} />
												<DownloadResumeButton resumeId={resume.id!} resumeName={resume.resumeName} role={resume.role} />

												{/* <Button
												variant="ghost"
												size="sm"
												className="text-red-600 hover:text-red-800"
                                                >
												<Trash2 className="w-4 h-4" />
											</Button> */}
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
