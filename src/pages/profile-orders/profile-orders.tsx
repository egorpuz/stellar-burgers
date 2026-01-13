import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { getOrdersApi } from '../../utils/burger-api';
import { Preloader } from '@ui';
import { OrdersList, ProfileMenu } from '@components';

export const ProfileOrders: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);

      getOrdersApi()
        .then((data) => {
          setOrders(data);
        })
        .catch((err) => {
          console.error('Ошибка загрузки заказов:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <ProfileOrdersUI orders={orders} />
    </>
  );
};
