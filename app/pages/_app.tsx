import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import '@mantine/core/styles.css';
import '../globals.css';
import '@mantine/carousel/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  // fontFamily: 'Greycliff CF, sans-serif',
  colors: {
    'pastel-purple': ['#e6deff', '#e0d6ff', '#e3daff', '#e9e2ff', '#ece6ff', '#af94e1', '#b19cd9', '#b3a2d3', '#ba93d8', '#c08de3'],
    'forest-green': ['#0A5C36', '#0F5132', '#14452F', '#18392B', '#1D2E28', '#344E41', '#3A5A40', '#094A25', '#013220', '#014421'],
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  return (

    <MantineProvider theme={theme} withGlobalClasses>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
    </MantineProvider>
  );
};

export default App;