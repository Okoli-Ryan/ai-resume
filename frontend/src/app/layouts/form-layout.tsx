import { Card, CardContent } from "@/components/ui/card";

const FormLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Card className="border-0 shadow-none md:shadow md:border">
			<CardContent className="py-4 flex flex-col gap-4 p-0 md:p-6">{children}</CardContent>
		</Card>
	);
};

export default FormLayout;
