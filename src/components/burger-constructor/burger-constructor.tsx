import { FC, useMemo } from 'react';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  closeOrder
} from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const {
    bun,
    ingredients = [],
    orderRequest,
    orderModalData
  } = useSelector((state: RootState) => state.constructor);

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [bun, ingredients]
  );

  const onOrderClick = () => {
    const isAuthenticated = Boolean(localStorage.getItem('accessToken'));

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (!bun || orderRequest) return;
    const ingredientIds = ingredients.map((item) => item._id);
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
