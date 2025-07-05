import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
            {subtitle && (
              <p className="text-sm text-neutral-500">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}
