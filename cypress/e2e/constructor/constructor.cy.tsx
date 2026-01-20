describe('Интеграционные тесты конструктора бургера', () => {
  const mockIngredients = {
    success: true,
    data: [
      {
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
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
      }
    ]
  };

  const mockUser = {
    success: true,
    user: {
      email: 'test@test.com',
      name: 'Test User'
    }
  };

  const mockOrderResponse = {
    success: true,
    name: 'Краторный био-бургер',
    order: {
      number: 66666
    }
  };

  const bunName = 'Краторная булка N-200i';
  const mainName = 'Биокотлета из марсианской Магнолии';

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { body: mockIngredients }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Работа с ингредиентами', () => {
    it('добавлять ингредиенты в конструктор', () => {
      cy.contains(bunName).parents('li').find('button').click();

      cy.contains(mainName).parents('li').find('button').click();

      cy.contains(`${bunName} (верх)`).should('exist');
      cy.contains(`${bunName} (низ)`).should('exist');
      cy.contains(mainName).should('exist');
    });
  });

  describe('Работа модальных окон', () => {
    it('открывать модальное окно при клике на ингредиент', () => {
      cy.contains(bunName).click();

      cy.contains(bunName).should('be.visible');
      cy.contains('Калории').should('be.visible');
    });

    it('закрывать модальное окно при клике на крестик', () => {
      cy.contains(bunName).click();

      cy.get('#modals').find('button').first().click();

      cy.get('#modals').children().should('have.length', 0);
    });

    it('закрывать модальное окно при клике на оверлей', () => {
      cy.contains(bunName).click();

      cy.contains('Калории').should('be.visible');

      cy.get('body').click(0, 0);

      cy.get('#modals').children().should('have.length', 0);
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', { body: mockUser }).as('getUser');
      cy.intercept('POST', '**/api/orders', {
        body: mockOrderResponse
      }).as('createOrder');

      cy.setCookie('accessToken', 'Bearer test-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    afterEach(() => {
      cy.clearCookies();
      localStorage.clear();
    });

    it('успешно создавать заказ', () => {
      cy.contains(bunName).parents('li').find('button').click();

      cy.contains(mainName).parents('li').find('button').click();

      cy.contains('Оформить заказ').click();

      cy.wait('@createOrder');

      cy.contains(mockOrderResponse.order.number).should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');

      cy.get('#modals').find('button').first().click();

      cy.get('#modals').children().should('have.length', 0);

      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
