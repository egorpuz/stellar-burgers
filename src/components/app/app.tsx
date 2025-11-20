import '../../index.css';
import styles from './app.module.css';

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import { AppHeader } from '@components';
import { ConstructorPage } from '@pages';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404';

import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { resetConstructor } from '../../services/slices/constructorSlice';
import { initializeAuth, setUser } from '../../services/slices/authSlice';
import { getUserApi } from '../../utils/burger-api';

export default function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch();

  const handleModalClose = () => navigate(-1);

  // Инициализация auth при загрузке приложения
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isAuth = Boolean(localStorage.getItem('refreshToken'));

    dispatch(initializeAuth({ user, isAuthenticated: isAuth }));

    // Если есть токен, загружаем свежие данные пользователя
    if (isAuth) {
      getUserApi()
        .then((data) => {
          if (data?.user) {
            dispatch(setUser(data.user));
          }
        })
        .catch((err) => {
          console.error('Ошибка загрузки пользователя:', err);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetConstructor());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:id' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={isAuthenticated ? <Navigate to='/' replace /> : <Login />}
        />
        <Route
          path='/register'
          element={isAuthenticated ? <Navigate to='/' replace /> : <Register />}
        />
        <Route
          path='/forgot-password'
          element={
            isAuthenticated ? <Navigate to='/' replace /> : <ForgotPassword />
          }
        />
        <Route
          path='/reset-password'
          element={
            isAuthenticated ? <Navigate to='/' replace /> : <ResetPassword />
          }
        />
        <Route
          path='/profile'
          element={
            isAuthenticated ? <Profile /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/profile/orders'
          element={
            isAuthenticated ? (
              <ProfileOrders />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route path='/profile/orders/:id' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:id'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:id'
            element={
              isAuthenticated ? (
                <Modal title='Детали вашего заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />
        </Routes>
      )}
    </div>
  );
}
