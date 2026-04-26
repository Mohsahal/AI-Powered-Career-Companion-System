import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
// Accept showShadow prop
const Header = ({ scrollContainerRef }) => {
    const [isScrolled, setIsScrolled] = useState(false); // Keep internal scroll state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { toast } = useToast();
    // Change header style on scroll based on the provided ref or window
    useEffect(() => {
        const scrollElement = scrollContainerRef?.current || window;
        const onScroll = () => {
            const scrollTop = scrollElement === window
                ? window.scrollY
                : scrollElement.scrollTop;
            setIsScrolled(scrollTop > 10);
        };
        scrollElement.addEventListener('scroll', onScroll);
        onScroll();
        return () => {
            scrollElement.removeEventListener('scroll', onScroll);
        };
    }, [scrollContainerRef]);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const navItems = [
        { text: "Home", path: "/" },
        { text: "Features", path: "/features" },
        { text: "Dashboard", path: "/dashboard", authRequired: true },
        { text: "About", path: "/about" }
    ];
    // Filter menu items based on authentication status
    const filteredNavItems = navItems.filter(item => !item.authRequired || (item.authRequired && isAuthenticated));
    return (
    // Apply shadow based on internal isScrolled state
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A044F5] to-[#7c3aed] flex items-center justify-center  ">
              <span className="text-white font-bold text-lg">FF</span>
            </div>
            <span className="font-bold text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#A044F5] to-[#7c3aed]">
              FutureFind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {filteredNavItems.map((item) => (<Link key={item.text} to={item.path} className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300">
                {item.text}
              </Link>))}
          </nav>

          {/* Auth/Profile Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name?.charAt(0) || 'U'}&size=128&font-size=0.5&bold=true`} alt={user?.name || ""}/>
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl">
                  <div className="px-3 py-2 border-b border-gray-100 mb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name?.charAt(0) || 'U'}&color=black&size=128&font-size=0.5&bold=true`} alt={user?.name || ""}/>
                        <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuItem className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 rounded-lg transition-all duration-200 cursor-pointer group">
                    <Link to="/profile" className="flex items-center w-full">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors duration-200">
                        <User className="h-4 w-4 text-indigo-600"/>
                      </div>
                      <span className="font-medium">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* <DropdownMenuItem className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 rounded-lg transition-all duration-200 cursor-pointer group">
              <Link to="/settings" className="flex items-center w-full">
                <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                  <Settings className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Settings</span>
              </Link>
            </DropdownMenuItem> */}
                  
                  
                     
                  
                  <div className="border-t border-gray-100 my-2"></div>
                  
                  <DropdownMenuItem onClick={logout} className="flex items-center px-3 py-2.5 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 rounded-lg transition-all duration-200 cursor-pointer group">
                    <div className="p-2 bg-red-100 rounded-lg mr-3 group-hover:bg-red-200 transition-colors duration-200">
                      <LogOut className="h-4 w-4 text-red-600"/>
                    </div>
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>) : (<>
                <Link to="/auth" state={{ activeTab: 'login' }}>
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/auth" state={{ activeTab: 'signup' }}>
                  <Button variant="default">Sign up</Button>
                </Link>
              </>)}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Open menu">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (<div className="md:hidden py-4 bg-white dark:bg-gray-900 rounded-b-lg shadow-lg animate-slide-up">
            <nav className="flex flex-col space-y-4 px-4">
              {filteredNavItems.map((item) => (<Link key={item.text} to={item.path} className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.text}
                </Link>))}
              {isAuthenticated ? (<Button variant="ghost" className="justify-start px-2" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4"/>
                  Logout
                </Button>) : (<div className="flex flex-col space-y-2">
                  <Link to="/auth" state={{ activeTab: 'login' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/auth" state={{ activeTab: 'signup' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>)}
            </nav>
          </div>)}
      </div>
    </header>);
};
export default Header;
