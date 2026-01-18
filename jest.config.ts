import type { Config } from 'jest';

const config: Config = {
  // Базовая настройка для TypeScript
  preset: 'ts-jest',

  // Собирать покрытие тестами (по желанию, у тебя было true)
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  // Маппинг путей (обязательно для алиасов @api и т.д.)
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
    '^@selectors/(.*)$': '<rootDir>/src/services/selectors/$1'
  },

  // Обработка ts/tsx файлов
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}]
  }
};

export default config;
