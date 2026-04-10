"use client";

import { XIcon } from "lucide-react";
import { KeyboardEvent, useRef, useState } from "react";

import { getColorFromText } from "@/lib/utils";


interface TagSearchInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
}

const TagSearchInput = ({ value, onChange, placeholder = "Add tag..." }: TagSearchInputProps) => {
	const [input, setInput] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const addTag = (raw: string) => {
		const trimmed = raw.trim();
		if (!trimmed || value.includes(trimmed)) return;
		onChange([...value, trimmed]);
		setInput("");
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag(input);
		} else if (e.key === "Backspace" && input === "" && value.length > 0) {
			onChange(value.slice(0, -1));
		}
	};

	const removeTag = (index: number) => {
		const updated = [...value];
		updated.splice(index, 1);
		onChange(updated);
	};

	return (
		<div
			className="flex flex-wrap items-center gap-1.5 min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm cursor-text"
			onClick={() => inputRef.current?.focus()}
		>
			{value.map((tag, i) => {
				const colors = getColorFromText(tag);
				return (
					<span
						key={i}
						className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
						style={colors}
					>
						{tag}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								removeTag(i);
							}}
							className="hover:opacity-70 transition-opacity"
						>
							<XIcon className="h-3 w-3" />
							<span className="sr-only">Remove {tag}</span>
						</button>
					</span>
				);
			})}
			<input
				ref={inputRef}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={value.length === 0 ? placeholder : ""}
				className="flex-1 min-w-20 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
			/>
		</div>
	);
};

export default TagSearchInput;
