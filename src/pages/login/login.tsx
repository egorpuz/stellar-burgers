import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '../../utils/burger-api';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';
import { useDispatch } from 'react-redux';
import { setUser } from '../../services/slices/authSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUserApi({ email, password });

      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);

      dispatch(setUser(data.user));

      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при входе');
    }
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
