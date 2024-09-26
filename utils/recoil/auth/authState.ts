import nookies from 'nookies';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { RefreshTokenPrams, useAuthService } from '@/services/authService';
import { User } from '@/types';

const { persistAtom } = recoilPersist();
const MILLISECOND = 1000;

export type AuthState = {
  authUser: User | null;
  isRemember: boolean;
  expiresIn: number;
  refreshTokenTimeout: number;
};

export const authState = atom<AuthState>({
  key: 'auth',
  default: {
    authUser: null,
    isRemember: false,
    expiresIn: 0,
    refreshTokenTimeout: 0,
  },
  effects_UNSTABLE: [persistAtom],
});

export const useAuthStore = () => {
  const [state, setState] = useRecoilState(authState);

  const setAuthUser = (user: User | null) => {
    setState((prevState) => ({ ...prevState, authUser: user }));
  };

  const setIsRemember = (value: boolean) => {
    setState((prevState) => ({ ...prevState, isRemember: value }));
  };

  const setExpiresIn = (expiresIn: number) => {
    setState((prevState) => ({ ...prevState, expiresIn }));
  };

  const setAccessToken = (accessToken: string, ctx = null) => {
    nookies.set(ctx, 'accessToken', accessToken, {
      maxAge: 60 * 60,
      path: '/',
    });
  };

  const setRefreshToken = (refreshToken: string, ctx = null) => {
    nookies.set(ctx, 'refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  };

  const handleRefresh = async (ctx = null) => {
    const cookies = nookies.get(ctx);
    const refreshToken = cookies?.refreshToken;
    if (refreshToken) {
      const authService = useAuthService();
      const partial = { refresh_token: refreshToken } as RefreshTokenPrams;

      try {
        const res: any = await authService.refreshToken(partial);
        setAccessToken(res?.data.access_token, ctx);
        startRefreshTokenTimer();
      } catch (error) {
        logout(ctx);
      }
    }
  };

  const startRefreshTokenTimer = () => {
    const timeout = state.expiresIn * MILLISECOND; // Timeout in milliseconds
    const timer = setTimeout(() => handleRefresh(), timeout);
    // Update state with the new timeout ID
    setState((prevState: AuthState) => ({
      ...prevState,
      refreshTokenTimeout: Number(timer),
    }));
  };

  const stopRefreshTokenTimer = () => {
    clearTimeout(state.refreshTokenTimeout);

    // Reset the refresh token timeout ID in the state
    setState((prevState: AuthState) => ({
      ...prevState,
      refreshTokenTimeout: 0,
    }));
  };

  const logout = (ctx = null) => {
    setState({
      authUser: null,
      isRemember: false,
      expiresIn: 0,
      refreshTokenTimeout: 0,
    });
    nookies.destroy(ctx, 'accessToken');
    nookies.destroy(ctx, 'refreshToken');
    stopRefreshTokenTimer();
  };

  return {
    ...state,
    setAuthUser,
    setIsRemember,
    setExpiresIn,
    setAccessToken,
    setRefreshToken,
    handleRefresh,
    startRefreshTokenTimer,
    stopRefreshTokenTimer,
    logout,
  };
};
