import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserApi } from '../../utils/burger-api';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';
import { setUser } from '../../services/slices/authSlice';
import { useDispatch } from 'react-redux';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await registerUserApi({ name: userName, email, password });

      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);

      dispatch(setUser(data.user));

      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
    }
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
