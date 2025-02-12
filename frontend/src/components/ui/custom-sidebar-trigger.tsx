import { useSidebar } from "@/components/ui/sidebar";
import { PanelsLeftBottom } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className="p-3 rounded-md group hover:bg-gray-100 dark:hover:bg-sidebar-accent"
      onClick={toggleSidebar}
    >
      <PanelsLeftBottom className="size-5 text-muted-foreground" />
    </button>
  );
}
