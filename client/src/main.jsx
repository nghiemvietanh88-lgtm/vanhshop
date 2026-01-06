// i18n
import './i18n';

// Polyfill for @react-pdf/renderer
import Buffer from './utils/polyfill-buffer';
window.Buffer = Buffer;

// scroll bar
import 'simplebar/src/simplebar.css';

// highlight
import './utils/highlight';

// editor
import 'react-quill/dist/quill.snow.css';

// lightbox
import 'react-image-lightbox/style.css';

// slick-carousel
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

// lazy image
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

// simplebar-react
import 'simplebar/dist/simplebar.min.css';

// react-phone-input-2
import 'react-phone-input-2/lib/material.css';

import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
// redux
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';
// contexts
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { SettingsProvider } from './contexts/SettingsContext';
//
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

// ----------------------------------------------------------------------

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <ReduxProvider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <BrowserRouter>
              <AuthProvider>
                <OrderProvider>
                  <App />
                </OrderProvider>
              </AuthProvider>
            </BrowserRouter>
          </SettingsProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </ReduxProvider>
  </HelmetProvider>
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
