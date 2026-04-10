"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import TagSearchInput from "./tag-search-input";

interface AdvancedFilterProps {
	tags: string[];
	onTagsChange: (tags: string[]) => void;
	dateFrom: string;
	onDateFromChange: (val: string) => void;
	dateTo: string;
	onDateToChange: (val: string) => void;
	isFavourite: boolean;
	onIsFavouriteChange: (val: boolean) => void;
}

const AdvancedFilter = ({
	tags,
	onTagsChange,
	dateFrom,
	onDateFromChange,
	dateTo,
	onDateToChange,
	isFavourite,
	onIsFavouriteChange,
}: AdvancedFilterProps) => {
	const [open, setOpen] = useState(false);

	const activeCount = [tags.length > 0, !!dateFrom || !!dateTo, isFavourite].filter(Boolean).length;

	return (
		<div className="contents">
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setOpen((o) => !o)}
					className="flex items-center gap-2"
				>
					<SlidersHorizontal className="h-4 w-4" />
					Advanced filters
					{activeCount > 0 && (
						<span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
							{activeCount}
						</span>
					)}
				</Button>
			</div>

			{open && (
				<div className="basis-full rounded-lg border border-input bg-card p-4 flex flex-col gap-4 shadow-sm">
					<div className="flex flex-col gap-1.5">
						<Label>Filter by tags</Label>
						<TagSearchInput
							value={tags}
							onChange={onTagsChange}
							placeholder="Type a tag and press Enter or comma..."
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						<div className="flex flex-col gap-1.5 flex-1">
							<Label htmlFor="dateFrom">Created from</Label>
							<input
								id="dateFrom"
								type="date"
								value={dateFrom}
								onChange={(e) => onDateFromChange(e.target.value)}
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							/>
						</div>
						<div className="flex flex-col gap-1.5 flex-1">
							<Label htmlFor="dateTo">Created to</Label>
							<input
								id="dateTo"
								type="date"
								value={dateTo}
								onChange={(e) => onDateToChange(e.target.value)}
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							/>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Switch
							id="isFavourite"
							checked={isFavourite}
							onCheckedChange={onIsFavouriteChange}
						/>
						<Label htmlFor="isFavourite">Favourites only</Label>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdvancedFilter;
