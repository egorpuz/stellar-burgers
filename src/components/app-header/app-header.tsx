import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { RootState } from 'src/services/store';

export const AppHeader: FC = () => {
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  return <AppHeaderUI userName={userName} />;
};
