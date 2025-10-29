import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';

export const Feed: FC = () => {
  const { orders } = useSelector((state: RootState) => state.feed);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
