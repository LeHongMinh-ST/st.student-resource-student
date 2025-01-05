import nookies from 'nookies';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { RefreshTokenPrams, useAuthService } from '@/services/authService';
import { Student } from '@/types';

const { persistAtom } = recoilPersist();
const MILLISECOND = 1000;

export type AuthState = {
  authUser: Student | null;
  isRemember: boolean;
  expiresIn: number;
  refreshTokenStudentTimeout: number;
};

export const authState = atom<AuthState>({
  key: 'auth',
  default: {
    authUser: null,
    isRemember: false,
    expiresIn: 0,
    refreshTokenStudentTimeout: 0,
  },
  effects_UNSTABLE: [persistAtom],
});

export const useAuthStore = () => {
  const [state, setState] = useRecoilState(authState);

  const setAuthUser = (user: Student | null) => {
    setState((prevState) => ({ ...prevState, authUser: user }));
  };

  const setIsRemember = (value: boolean) => {
    setState((prevState) => ({ ...prevState, isRemember: value }));
  };

  const setExpiresIn = (expiresIn: number) => {
    setState((prevState) => ({ ...prevState, expiresIn }));
  };

  const setAccessToken = (accessTokenStudent: string, ctx = null) => {
    nookies.set(ctx, 'accessTokenStudent', accessTokenStudent, {
      maxAge: 60 * 60,
      path: '/',
    });
  };

  const setRefreshToken = (refreshTokenStudent: string, ctx = null) => {
    nookies.set(ctx, 'refreshTokenStudent', refreshTokenStudent, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  };

  const handleRefresh = async (ctx = null) => {
    const cookies = nookies.get(ctx);
    const refreshTokenStudent = cookies?.refreshTokenStudent;
    if (refreshTokenStudent) {
      const authService = useAuthService();
      const partial = { refresh_token: refreshTokenStudent } as RefreshTokenPrams;

      try {
        const res: any = await authService.refreshTokenStudent(partial);
        setAccessToken(res?.data.access_token, ctx);
        startRefreshTokenTimer();
      } catch (error) {
        logout(ctx);
      }
    }
  };

  const handleRefreshProfile = () => {
    const authService = useAuthService();
    authService.getProfile().then((res) => {
      setAuthUser(res.data.data);
    });
  };

  const startRefreshTokenTimer = () => {
    const timeout = state.expiresIn * MILLISECOND; // Timeout in milliseconds
    const timer = setTimeout(() => handleRefresh(), timeout);
    // Update state with the new timeout ID
    setState((prevState: AuthState) => ({
      ...prevState,
      refreshTokenStudentTimeout: Number(timer),
    }));
  };

  const stopRefreshTokenTimer = () => {
    clearTimeout(state.refreshTokenStudentTimeout);

    // Reset the refresh token timeout ID in the state
    setState((prevState: AuthState) => ({
      ...prevState,
      refreshTokenStudentTimeout: 0,
    }));
  };

  const logout = (ctx = null) => {
    setState({
      authUser: null,
      isRemember: false,
      expiresIn: 0,
      refreshTokenStudentTimeout: 0,
    });
    nookies.destroy(ctx, 'accessTokenStudent');
    nookies.destroy(ctx, 'refreshTokenStudent');
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
    handleRefreshProfile,
  };
};
