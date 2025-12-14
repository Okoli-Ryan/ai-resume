import { format } from 'date-fns';
import { Control, Path } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TResume } from '@/types/resume';

const DateFormItem = ({ name, control, label, disabled }: { control: Control<TResume, any>; name: Path<TResume>; label: string; disabled?: boolean }) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field: { onChange, value, ...rest } }) => (
				<FormItem>
					<FormLabel className="text-sm font-medium">{label}</FormLabel>
					<FormControl>
						<Input
							disabled={disabled}
							type="month"
							{...rest}
							value={value ? format(new Date(value as string), "yyyy-MM") : ""}
							onChange={(e) => {
								const raw = e.target.value; // e.g., "2025-06"
								const fullDate = new Date(`${raw}-01`); // Create full date: 2025-06-01
								onChange(fullDate.toISOString()); // or onChange(fullDate) if storing as Date object
							}}
							className="transition-all focus:ring-2 focus:ring-primary/20"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default DateFormItem;
