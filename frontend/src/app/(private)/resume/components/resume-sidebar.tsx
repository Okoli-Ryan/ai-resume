import { ChevronDown, PanelRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ResumeFormSections } from "@/lib/react-pdf";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { memo } from "react";

const ResumeSidebar = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className="fixed bottom-8 right-8 size-12 flex justify-center items-center rounded-full bg-primary text-white shadow-lg">
					<PanelRight />
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[calc(100vw-1.5rem)] md:max-w-[600px]">
				<SheetHeader>
					<SheetTitle>Update details</SheetTitle>
					<SheetDescription>Make changes to your resume here. Click save when you&apos;re done.</SheetDescription>
				</SheetHeader>
				<div className="h-[calc(100dvh-7rem)] overflow-auto">
					<Accordion allowMultiple={false} transition transitionTimeout={200} className="mt-4 p-2 space-y-3">
						{ResumeFormSections.map((ResumeForm) => (
							<AccordionItem
								buttonProps={{
									className: "flex justify-between items-center w-full py-2",
								}}
								contentProps={{ className: "transition-all duration-200 ease-in-out" }}
								key={ResumeForm.displayName}
								header={
									<>
										<h2 className="text-sm md:text-base font-semibold">{ResumeForm.displayName}</h2>
										<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
									</>
								}>
								<ResumeForm />
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default memo(ResumeSidebar);
