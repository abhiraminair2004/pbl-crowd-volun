import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          VeridaX
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-primary-dark hover:text-primary transition-colors">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/crowdfunding" className="text-primary-dark hover:text-primary transition-colors">
                Crowdfunding
              </Link>
              <Link to="/volunteer" className="text-primary-dark hover:text-primary transition-colors">
                Volunteer
              </Link>
            </>
          )}
          <Link to="/about" className="text-primary-dark hover:text-primary transition-colors">
            About Us
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outline">
              Log Out
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" className="hidden md:inline-flex">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
