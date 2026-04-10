"use client";

import { useState } from "react";
import { useController, useForm } from "react-hook-form";

import { MinimalResumeQueryFilters, useMinimalResumes } from "@/queries/use-minimal-resumes";
import { TResume } from "@/types/resume";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import AdvancedFilter from "./advanced-filter";
import CreateResumeButton from "./create-resume-button";
import ResumeTable from "./resume-table";

type FilterFormValues = {
	resumeName: string;
	tags: string[];
	dateFrom: string;
	dateTo: string;
	isFavourite: boolean;
};

interface DashboardContentProps {
	initialResumes: Partial<TResume>[];
}

const DashboardContent = ({ initialResumes }: DashboardContentProps) => {
	const [activeFilters, setActiveFilters] = useState<MinimalResumeQueryFilters>({});

	const { register, handleSubmit, control } = useForm<FilterFormValues>({
		defaultValues: {
			resumeName: "",
			tags: [],
			dateFrom: "",
			dateTo: "",
			isFavourite: false,
		},
	});

	const { field: tagsField } = useController({ name: "tags", control });
	const { field: dateFromField } = useController({ name: "dateFrom", control });
	const { field: dateToField } = useController({ name: "dateTo", control });
	const { field: isFavouriteField } = useController({ name: "isFavourite", control });

	const onSubmit = (data: FilterFormValues) => {
		setActiveFilters({
			resumeName: data.resumeName || undefined,
			tags: data.tags.length > 0 ? data.tags.join(",") : undefined,
			dateFrom: data.dateFrom || undefined,
			dateTo: data.dateTo || undefined,
			isFavourite: data.isFavourite || undefined,
		});
	};

	const { data: resumes = [], isLoading } = useMinimalResumes(activeFilters, initialResumes);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
				<CreateResumeButton />
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
				<div className="flex flex-wrap gap-2 items-start">
					<Input placeholder="Search by resume name..." {...register("resumeName")} className="flex-1 min-w-0 max-w-sm" />
					<AdvancedFilter
						tags={tagsField.value}
						onTagsChange={tagsField.onChange}
						dateFrom={dateFromField.value}
						onDateFromChange={dateFromField.onChange}
						dateTo={dateToField.value}
						onDateToChange={dateToField.onChange}
						isFavourite={isFavouriteField.value}
						onIsFavouriteChange={isFavouriteField.onChange}
					/>
					<Button type="submit" className="self-start">Search</Button>
				</div>
			</form>

			<div className="w-full overflow-x-auto">
				<ResumeTable resumes={resumes} isLoading={isLoading} />
			</div>
		</div>
	);
};

export default DashboardContent;
