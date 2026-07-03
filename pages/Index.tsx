import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'warden') {
        navigate('/warden/dashboard');
      } else {
        navigate('/dashboard'); // student
      }
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  return null;
};

export default Index;
