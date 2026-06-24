import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { SSRProvider } from '@react-aria/ssr'; // Or another library if applicable
import 'bootstrap/dist/css/bootstrap.css'
import 'styles/theme.css'
import store from '../store/index';
const MyApp = React.forwardRef(({
  Component, pageProps,
}: AppProps, ref) => {
  return (
    // <Provider store={store}>
    //   <Component {...pageProps} />
    // </Provider>
    <SSRProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SSRProvider>
  );
})

export default MyApp;
