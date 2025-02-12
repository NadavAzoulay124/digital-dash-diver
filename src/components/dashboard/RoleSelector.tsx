
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const COMPANY_ROLES = [
  {
    role: "Campaign Manager",
    employee: "John Doe",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
  },
  {
    role: "Designer",
    employee: "Jane Smith",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    role: "Customer Manager",
    employee: "Mike Johnson",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    role: "Social Media Manager",
    employee: "Jane Smith",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    role: "Content Strategist",
    employee: "John Doe",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
  }
] as const;

export type CompanyRole = typeof COMPANY_ROLES[number]["role"];

interface RoleSelectorProps {
  selectedRole: CompanyRole;
  onRoleSelect: (role: CompanyRole) => void;
}

export const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      {COMPANY_ROLES.map(({ role, employee, image }) => (
        <Button
          key={role}
          variant={selectedRole === role ? "default" : "outline"}
          onClick={() => onRoleSelect(role)}
          className="whitespace-nowrap text-sm flex items-center gap-2 h-auto py-1.5"
          size="sm"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={image} alt={employee} />
            <AvatarFallback>{employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span>{role}</span>
        </Button>
      ))}
    </div>
  );
};
