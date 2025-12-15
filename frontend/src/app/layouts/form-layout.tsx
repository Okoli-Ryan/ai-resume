import { Card, CardContent } from "@/components/ui/card";

const FormLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg bg-card">
			<CardContent className="py-5 flex flex-col gap-5 p-4 md:p-6">{children}</CardContent>
		</Card>
	);
};

export default FormLayout;
