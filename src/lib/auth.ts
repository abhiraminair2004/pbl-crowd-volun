import { toast } from "sonner";

export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const requireAuth = (action: string) => {
  if (!isAuthenticated()) {
    toast.error(`Please log in to ${action}`);
    return false;
  }
  return true;
};