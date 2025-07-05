import { Link, useLocation } from "wouter";
import { 
  FolderOpen, 
  Plus, 
  ChartLine, 
  Calculator, 
  FileText, 
  ArrowUp, 
  ArrowDown,
  Gauge,
  User,
  Zap
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Gauge, section: "Projects" },
    { href: "/projects", label: "All Projects", icon: FolderOpen, section: "Projects" },
    { href: "/projects/new", label: "New Project", icon: Plus, section: "Projects" },
    { href: "/cash-flow", label: "Cash Flow", icon: ChartLine, section: "Financial" },
    { href: "/irr", label: "IRR Calculator", icon: Calculator, section: "Financial" },
    { href: "/reports", label: "P&L Reports", icon: FileText, section: "Financial" },
    { href: "/payments", label: "All Payments", icon: ArrowUp, section: "Payments" },
    { href: "/suppliers", label: "Suppliers", icon: User, section: "Components" },
    { href: "/components", label: "Cost Components", icon: ArrowDown, section: "Components" },
  ];

  const sections = Array.from(new Set(navItems.map(item => item.section)));

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-neutral-200 flex flex-col">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-bold text-neutral-800">Solar Finance Pro</span>
        </div>
      </div>
      
      <div className="flex-1 py-6">
        {sections.map((section) => (
          <div key={section} className="px-6 mb-6">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              {section}
            </h3>
            <ul className="space-y-2">
              {navItems
                .filter(item => item.section === section)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-neutral-600 hover:text-primary hover:bg-primary/10"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="p-6 border-t border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center">
            <User className="text-neutral-600 w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800">John Doe</p>
            <p className="text-xs text-neutral-500">Project Manager</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
