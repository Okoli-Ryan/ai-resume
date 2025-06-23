import { Control, FieldValues, Path } from 'react-hook-form';

type ErrorLabelProps<T extends FieldValues> = {
	name: Path<T>;
	control: Control<T, any>;
};

const ErrorLabel = <T extends FieldValues>({ name, control }: ErrorLabelProps<T>) => {
	const errorMessage = control.getFieldState(name).error?.message;
	return <>{errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}</>;
};

export default ErrorLabel;
