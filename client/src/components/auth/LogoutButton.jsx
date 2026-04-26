import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/auth"); // Redirect to auth page after logout
    };
    return (<Button onClick={handleLogout} variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50">
      <LogOut size={20}/>
      <span>Logout</span>
    </Button>);
};
export default LogoutButton;
