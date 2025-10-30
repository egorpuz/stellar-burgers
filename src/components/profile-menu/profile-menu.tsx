import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/slices/authSlice';
import { ProfileMenuUI } from '../ui/profile-menu';

export const ProfileMenuContainer: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');

    dispatch(logout());

    navigate('/login', { replace: true });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
