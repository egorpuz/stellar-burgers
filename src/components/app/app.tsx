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
import { useDispatch, useSelector } from 'react-redux';
import { resetConstructor } from '../../services/slices/constructorSlice';
import { setUser } from '../../services/slices/authSlice';
import { getUserApi } from '../../utils/burger-api';
import { RootState, AppDispatch } from 'src/services/store';

export default function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch<AppDispatch>();

  const handleModalClose = () => navigate(-1);

  useEffect(() => {
    dispatch(resetConstructor());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('refreshToken');
    if (token) {
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

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
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
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
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
            path='/profile/orders/:number'
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
