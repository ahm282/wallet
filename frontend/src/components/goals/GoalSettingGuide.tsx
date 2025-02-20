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
import { Target } from "lucide-react";

interface GoalSettingGuideProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export const GoalSettingGuide: React.FC<GoalSettingGuideProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Credenza open={isOpen} onOpenChange={onClose}>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle className="ms-2.5 flex items-center gap-x-4">
            <Target className="size-5" />
            Goal Setting 101
          </CredenzaTitle>
          <CredenzaDescription>
            Simple steps to create and reach your financial goals
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <ol className="space-y-5 text-sm mt-2 mb-4 w-11/12 mx-auto leading-normal list-decimal list-inside">
            <li className="border-b border-muted pb-2">
              <strong className="font-semibold">Define Your Vision:</strong>{" "}
              Clearly articulate what you want to achieve financially. Whether
              it's saving for a home, education, or an emergency fund, your
              vision is your starting point. 🌟
            </li>
            <li className="border-b border-muted pb-2">
              <strong className="font-semibold">Set Specific Targets:</strong>{" "}
              Decide on a concrete goal with a target amount and timeline.
              Breaking it down into smaller milestones can help you stay on
              track. 🎯
            </li>
            <li className="border-b border-muted pb-2">
              <strong className="font-semibold">Create an Action Plan:</strong>{" "}
              Outline how much to save and what steps to take each month. Adjust
              your spending habits and automate savings if possible. 💰
            </li>
            <li className="border-b border-muted pb-2">
              <strong className="font-semibold">Monitor Your Progress:</strong>{" "}
              Regularly check your progress and celebrate small wins. Use tools
              or apps to track your milestones. 📈
            </li>
            <li>
              <strong className="font-semibold">Stay Committed:</strong> Revisit
              your goals often, stay motivated, and adjust your plan as needed.
              Consistency is key to success! 🚀
            </li>
          </ol>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose>
            <Button variant="default" className="w-11/12">
              Got it!
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default GoalSettingGuide;
