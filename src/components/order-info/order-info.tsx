import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getFeeds } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { OrderDetailsUI } from '@ui';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [singleOrder, setSingleOrder] = useState<TOrder | null>(null);
  const [singleOrderLoading, setSingleOrderLoading] = useState(false);

  const orders = useSelector((state: RootState) => state.feed.orders);
  const feedLoading = useSelector((state: RootState) => state.feed.isLoading);

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );
  const ingredientsLoading = useSelector(
    (state: RootState) => state.ingredients.isLoading
  );

  useEffect(() => {
    if (!feedLoading && orders.length === 0) {
      dispatch(getFeeds());
    }
  }, []);

  useEffect(() => {
    const orderInList = orders.find((order) => String(order.number) === id);

    if (orderInList) {
      setSingleOrder(orderInList);
    } else if (id && !singleOrderLoading) {
      setSingleOrderLoading(true);
      getOrderByNumberApi(Number(id))
        .then((data) => {
          setSingleOrder(data.orders?.[0] || null);
        })
        .catch((err) => {
          console.error('Ошибка загрузки заказа:', err);
          setSingleOrder(null);
        })
        .finally(() => {
          setSingleOrderLoading(false);
        });
    }
  }, [id, orders]);

  const orderData = singleOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients || ingredients.length === 0) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (feedLoading || ingredientsLoading || singleOrderLoading || !orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
