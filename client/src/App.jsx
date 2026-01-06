import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import SimpleBarReact from 'simplebar-react';
// routes
import Router from './routes/index';
// theme
import ThemeConfig from './theme/index';
// hooks
import { useAuth, useInterval } from './hooks';
// components
import LoadingScreen from './components/LoadingScreen';
import NotistackProvider from './components/NotistackProvider';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import Settings from './components/settings/index';
import ThemePrimaryColor from './components/ThemePrimaryColor';

import { syncCart } from './redux/slices/cartSlice';
import { sendTrackingData } from './redux/slices/userBehaviorSlice';

const isDevMode = import.meta.env.DEV;

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch();
  const { isInitialized, isAuthenticated } = useAuth();

  useInterval(
    () => {
      dispatch(sendTrackingData());
    },
    isDevMode ? 10 : 5
  );

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      dispatch(syncCart(isAuthenticated));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated]);

  return (
    <SimpleBarReact style={{ maxHeight: '100vh' }}>
      <ThemeConfig>
        <ThemePrimaryColor>
          <RtlLayout>
            <NotistackProvider>
              <Settings />
              <ScrollToTop />
              {isInitialized ? <Router /> : <LoadingScreen />}
            </NotistackProvider>
          </RtlLayout>
        </ThemePrimaryColor>
      </ThemeConfig>
    </SimpleBarReact>
  );
}
