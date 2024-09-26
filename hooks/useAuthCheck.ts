import { useState, useEffect, useCallback } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const publicPaths = ['/login'];

const useAuthCheck = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(false);

  const authCheck = useCallback(
    (url: string) => {
      const path = url.split('?')[0];
      const cookies = parseCookies(); // Retrieves cookies on the client side
      const accessToken = cookies?.accessToken;
      if (!accessToken) {
        setAuthorized(false);
        if (!publicPaths.includes(path)) {
          router.push({
            pathname: '/login',
            query: { returnUrl: router.asPath },
          });
        }
      } else {
        setAuthorized(true);
        if (publicPaths.includes(path)) {
          router.push('/');
        }
      }
    },
    [publicPaths, router]
  );

  useEffect(() => {
    authCheck(router.asPath);

    const handleRouteChangeStart = () => setAuthorized(false);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [authCheck, router.events, router.asPath]);

  return authorized;
};

export default useAuthCheck;
