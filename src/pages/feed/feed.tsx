import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { orders, isLoading } = useSelector((state: RootState) => state.feed);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <p className='text-center mt-8'>Заказов пока нет</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
