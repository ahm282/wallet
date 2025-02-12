import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";

interface BudgettingGuideProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export const BudgettingGuide: React.FC<BudgettingGuideProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Credenza open={isOpen} onOpenChange={onClose}>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Budgeting 101: Getting Started</CredenzaTitle>
          <CredenzaDescription>
            Simple steps to take control of your finances
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <ol className="space-y-5 text-sm mt-2 mb-4 w-11/12 mx-auto leading-normal list-decimal list-inside">
            <li className="border-b border-muted pb-2">
              <strong className="font-semibold">
                Track Your Income & Expenses:
              </strong>{" "}
              Record every source of income and each expense 📝. Knowing where
              your money goes is the first step toward control.
            </li>
            <li className="border-b border-muted pb-2">
              <strong className="font-semibold">
                Categorize Your Spending:
              </strong>{" "}
              Divide your costs into essentials (rent, groceries, utilities) and
              non-essentials (entertainment, dining out). This helps identify
              areas to trim. ✂️
            </li>
            <li className="border-b border-muted pb-2">
              <strong className="font-semibold">Set Realistic Goals:</strong>{" "}
              Allocate specific amounts for each category and aim to save a
              portion of your income 💰. Even small savings add up!
            </li>
            <li className="border-b border-muted pb-2">
              <strong className="font-semibold">Monitor & Adjust:</strong>{" "}
              Review your budget regularly and tweak it as needed. Flexibility
              is key to staying on track. 📈
            </li>
            <li>
              <strong className="font-semibold">Stay Consistent:</strong>{" "}
              Budgeting is a continuous process. Keep refining your plan and
              celebrate small wins along the way! 😉
            </li>
          </ol>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose>
            <Button variant="default" className="w-11/12">
              Great!
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default BudgettingGuide;
