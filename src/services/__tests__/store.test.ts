import { expect, test, describe } from '@jest/globals';
import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../slices/constructorSlice';
import {
  ingredientsReducer,
  fetchIngredients
} from '../slices/ingredientsSlice';

const mockIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: 'test-uuid-1'
};

const mockIngredient2 = {
  ...mockIngredient,
  id: 'test-uuid-2',
  name: 'Второй'
};
const mockIngredient3 = {
  ...mockIngredient,
  id: 'test-uuid-3',
  name: 'Третий'
};

const initialConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

import store, { rootReducer } from '../store';

describe('Redux Store Tests', () => {
  describe('rootReducer initialization', () => {
    test('Should return the initial state of the store', () => {
      const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

      expect(initialState).toEqual(store.getState());
    });
  });

  describe('burgerConstructor slice', () => {
    test('Should handle addIngredient', () => {
      const newState = constructorReducer(
        undefined,
        addIngredient(mockIngredient)
      );
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(mockIngredient);
    });

    test('Should handle removeIngredient', () => {
      const startState = {
        ...initialConstructorState,
        ingredients: [mockIngredient]
      };
      const newState = constructorReducer(
        startState,
        removeIngredient(mockIngredient.id)
      );
      expect(newState.ingredients).toHaveLength(0);
    });

    test('Should handle moveIngredient', () => {
      const startState = {
        ...initialConstructorState,
        ingredients: [mockIngredient, mockIngredient2, mockIngredient3]
      };

      const actionUp = moveIngredient({ index: 1, direction: 'up' });
      const newStateUp = constructorReducer(startState, actionUp);
      expect(newStateUp.ingredients).toEqual([
        mockIngredient2,
        mockIngredient,
        mockIngredient3
      ]);

      const actionDown = moveIngredient({ index: 1, direction: 'down' });
      const newStateDown = constructorReducer(startState, actionDown);
      expect(newStateDown.ingredients).toEqual([
        mockIngredient,
        mockIngredient3,
        mockIngredient2
      ]);
    });
  });

  describe('ingredients slice', () => {
    test('Should set isLoading to true on fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const newState = ingredientsReducer(undefined, action);
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('Should set ingredients and isLoading to false on fetchIngredients.fulfilled', () => {
      const mockData = [mockIngredient];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockData
      };
      const newState = ingredientsReducer(undefined, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.items).toEqual(mockData);
    });

    test('Should set error and isLoading to false on fetchIngredients.rejected', () => {
      const errorMessage = 'Error message';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const newState = ingredientsReducer(undefined, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
