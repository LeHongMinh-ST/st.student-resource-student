import { useRouter } from 'next/router';

export default function useMatchPath(basePath: string = ''): boolean {
  const router = useRouter();
  const matchPath = (pathname: string, path: string): boolean => {
    if (!path) return false;

    const cleanPathname = pathname.split('?')[0];
    const regex = new RegExp(`^${path}(\\/.*)?$`);
    return regex.test(cleanPathname);
  };

  return matchPath(router.pathname, basePath);
}
