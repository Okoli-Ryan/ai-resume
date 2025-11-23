import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Routes } from "@/lib/routes";
import { getRelativeTime } from "@/lib/utils";
import { TResume } from "@/types/resume";
import { format } from "date-fns";
import { Copy, Download, Edit, Eye } from "lucide-react";
import Link from "next/link";
import ResumeTags from "./resume-tags";

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

	// if (resumes.length === 0) {
	// 	return (
	// 		<Card>
	// 			<CardContent className="text-center py-12">
	// 				<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
	// 					<FileText className="w-12 h-12 text-gray-400" />
	// 				</div>
	// 				<h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm ? "No resumes found" : "No resumes yet"}</h3>
	// 				<p className="text-gray-500 mb-6">
	// 					{searchTerm ? "Try adjusting your search terms or filters" : "Get started by creating your first resume"}
	// 				</p>
	// 				{!searchTerm && (
	// 					<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
	// 						<Plus className="w-4 h-4 mr-2" />
	// 						Create Resume
	// 					</Button>
	// 				)}
	// 			</CardContent>
	// 		</Card>
	// 	);
	// }

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
							{resumes.map((resume) => (
								<TableRow key={resume.id} className="hover:bg-gray-50 transition-colors">
									<TableCell className=" max-w-60">
										<div className="flex items-center">
											<div>
												<div className="text-sm font-medium text-gray-900">{resume.resumeName}</div>
												{/* <div className="text-sm text-gray-500">{resume.template}</div> */}
											</div>
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
											<Link href={Routes.editResume(resume.id!)}>
												<Button variant="ghost" size="sm" className="hover:text-primary/80">
													<Eye className="w-4 h-4" />
												</Button>
											</Link>
											<Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
												<Edit className="w-4 h-4" />
											</Button>
											<Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
												<Copy className="w-4 h-4" />
											</Button>
											<Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
												<Download className="w-4 h-4" />
											</Button>
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
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
