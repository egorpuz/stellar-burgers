import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector((state: RootState) => state.feed.orders);

  return <ProfileOrdersUI orders={orders} />;
};
