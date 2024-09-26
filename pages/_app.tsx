import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { RecoilRoot } from 'recoil';
import { Notifications } from '@mantine/notifications';
import { MainLayout } from '@/layouts';
import '@/assets/styles/app.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import { theme } from '../theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Head>
          <title>Hệ thống quản lý sinh viên trực tuyến</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/images/logo.png" />
        </Head>
        <Notifications position="top-right" zIndex={1000} />
        <RecoilRoot>
          {pageProps.layout === 'unLoggedIn' ? (
            <Component {...pageProps} />
          ) : (
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          )}
        </RecoilRoot>
      </ModalsProvider>
    </MantineProvider>
  );
}
