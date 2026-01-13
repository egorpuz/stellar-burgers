import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { setUser } from '../../services/slices/authSlice';
import { ProfileUI } from '@ui-pages';
import { Preloader } from '@ui';
import { getUserApi } from '../../utils/burger-api';
import { useNavigate } from 'react-router-dom';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [isLoading, setIsLoading] = useState(!user);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await getUserApi();

        if (response.success) {
          dispatch(setUser(response.user));
        } else {
          setError('Не удалось загрузить данные пользователя');
        }
      } catch (err: any) {
        console.error('Ошибка загрузки профиля:', err);

        if (
          err.message === 'jwt expired' ||
          err.message === 'jwt malformed' ||
          err.message === 'Invalid or missing token'
        ) {
          setError('Сессия истекла. Пожалуйста, войдите снова.');
        } else if (err.message === 'User not found') {
          setError('Пользователь не найден');
        } else if (err.message.includes('Network')) {
          setError('Ошибка соединения с сервером');
        } else {
          setError('Произошла ошибка при загрузке профиля');
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!user) {
    navigate('/login');
    return;
  }

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setUpdateError(null);

    if (!formValue.name.trim() || !formValue.email.trim()) return;

    const updatedUser = {
      ...user,
      name: formValue.name,
      email: formValue.email
    };

    dispatch(setUser(updatedUser));

    console.log('✅ Profile saved:', updatedUser);

    setFormValue((prev) => ({ ...prev, password: '' }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
    setUpdateError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));

    if (updateError) setUpdateError(null);
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateError || ''}
    />
  );
};
