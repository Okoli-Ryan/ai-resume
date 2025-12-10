import { useEffect, useState } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';

import { TResume } from '@/types/resume';

import { FormLabel } from './ui/form';
import { Input } from './ui/input';
import Tag from './ui/tag';

type TagFormProps<T = TResume> = {
	form: UseFormReturn<Partial<T>, any, Partial<T>>; // react-hook-form instance
	name: Path<Partial<T>>;
	label: string;
	placeholder: string;
};

const TagsInputForm = <T,>({ form, name, label, placeholder }: TagFormProps<T>) => {
	const { setValue, getValues, register } = form;
	const [tags, setTags] = useState<string[]>([]);
	const [input, setInput] = useState("");

	// Initialize from form value (comma-separated string)
	useEffect(() => {
		const existing = getValues(name) as unknown as string;
		if (existing) {
			setTags(
				existing
					.split(",")
					.map((t: string) => t.trim())
					.filter(Boolean)
			);
		}
	}, [getValues, name]);

	// Update form value when tags change
	useEffect(() => {
		// @ts-expect-error Type casting issue
		setValue(name, tags.join(","));
	}, [tags, name, setValue]);

	const handleAdd = () => {
		const trimmed = input.trim();
		if (!trimmed || tags.includes(trimmed)) return;
		setTags([...tags, trimmed]);
		setInput("");
	};

	const handleUpdate = (index: number, newVal: string) => {
		const updated = [...tags];
		updated[index] = newVal.trim();
		setTags(updated);
	};

	const handleRemove = (index: number) => {
		const updated = [...tags];
		updated.splice(index, 1);
		setTags(updated);
	};

	return (
		<div className="space-y-2">
			<FormLabel>{label}</FormLabel>

			<Input
				placeholder={placeholder}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === ",") {
						e.preventDefault();
						return;
					}
					if (e.key === "Enter") {
						e.preventDefault();
						handleAdd();
					}
				}}
			/>

			<div className="flex flex-wrap gap-2">
				{tags.map((tag, i) => (
					<Tag key={i} value={tag} onUpdate={(val) => handleUpdate(i, val)} onRemove={() => handleRemove(i)} />
				))}
			</div>

			{/* Hidden input to register the field */}
			<input type="hidden" {...register(name)} />
		</div>
	);
};

export default TagsInputForm;
