import styled from '@emotion/styled';
import {
  Container,
  Paper,
  Stack,
  Image,
  TextInput,
  Button,
  Checkbox,
  LoadingOverlay,
} from '@mantine/core';
import { IconAlertTriangle, IconLock, IconLogin2, IconUser } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { LoginPrams, useAuthService } from '@/services/authService';
import { Surface } from '@/components';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import useAuthCheck from '@/hooks/useAuthCheck';

const LoginPage = () => {
  const iconUser = <IconUser width={18} />;
  const iconLock = <IconLock width={18} />;
  const iconLogin2 = <IconLogin2 width={18} />;
  const { push } = useRouter();

  const authorized = useAuthCheck();
  const authService = useAuthService();
  const authState = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPrams>({
    defaultValues: {
      user_name: '',
      password: '',
      remember: false,
    },
  });

  const handleSubmitForm = async (data: LoginPrams) => {
    if (!isSubmitting) {
      try {
        const res = await authService.login(data);

        authState.setExpiresIn(res.data.expires_in ?? 0);
        authState.setAccessToken(res.data.access_token ?? '');
        authState.setRefreshToken(res.data.refresh_token ?? '');
        authState.setIsRemember(data.remember);

        const profileRes = await authService.getProfile();
        authState.setAuthUser((profileRes as any)?.data?.data ?? null);
        if (data.remember) {
          authState.startRefreshTokenTimer();
        }
        push('/');
      } catch (e) {
        authState.setExpiresIn(0);
        authState.setAccessToken('');
        authState.setRefreshToken('');

        notifications.show({
          title: 'Đăng nhập thất bại!',
          message: 'Vui lòng khiểm tra tài khoản hoặc mật khẩu',
          icon: <IconAlertTriangle />,
          color: 'red',
          autoClose: 5000,
        });
      }
    }
  };
  const submitLogin = handleSubmit(handleSubmitForm);
  return (
    !authorized && (
      <LoginPageStyled>
        <LoadingOverlay visible={isSubmitting} />
        <Container className="loginContainer">
          <Stack align="center" justify="center" gap="md" className="loginStack">
            <Surface shadow="sm" p={16} radius="md" component={Paper} className="loginSurface">
              <div className="loginWrap">
                <div className="loginWrap__left">
                  <div className="loginWrap__logos">
                    <Image src="/images/logo-vnua.png" alt="logo" className="loginWrap__logo" />
                    <Image src="/images/logo.png" alt="logo" className="loginWrap__logo" />
                    <Image src="/images/logoST.jpg" alt="logo" className="loginWrap__logo" />
                  </div>
                  <div className="loginWrap__subtitle">
                    Khoa Công nghệ thông tin - Học viên Nông Nghiệp Việt Nam
                  </div>
                  <div className="loginWrap__title">
                    <h2>Hệ thống quản lý sinh viên trực tuyến</h2>
                  </div>
                  <Image src="/images/login.svg" alt="logo" className="loginWrap__image" />
                  <div className="loginWrap__footer">
                    <div className="loginWrap__footer__line"></div>
                    <div className="loginWrap__footer__text">
                      Lưu ý: Hệ thống quản lý sinh viên trực tuyến dành cho ban chủ nhiệm khoa, cán
                      bộ, giảng viên và sinh viên của từng khoa, do vậy nếu bạn chưa có tài khoản
                      xin vui lòng liên hệ với quản lý của khoa mình hoặc quản trị hệ thống để thiết
                      lập tài khoản.
                    </div>
                  </div>
                </div>
                <div className="loginWrap__right">
                  <div className="loginWrap__form">
                    <div className="loginWrap__form__header">
                      <h3>Đăng nhập hệ thống sinh viên</h3>
                    </div>
                    <div className="loginWrap__form__main">
                      <form className="loginForm" onSubmit={submitLogin}>
                        <TextInput
                          size="md"
                          label="Tài khoản/Email"
                          leftSection={iconUser}
                          {...register('user_name', {
                            required: ERROR_MESSAGES.login.user_name.required,
                          })}
                          error={errors.user_name?.message}
                        />
                        <TextInput
                          size="md"
                          label="Mật khẩu"
                          type="password"
                          leftSection={iconLock}
                          {...register('password', {
                            required: ERROR_MESSAGES.login.password.required,
                          })}
                          error={errors.password?.message}
                        />
                        <Checkbox label="Nhớ mật khẩu" {...register('remember')} />
                        <Button type="submit" leftSection={iconLogin2}>
                          Đăng nhập
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Surface>
          </Stack>
        </Container>
      </LoginPageStyled>
    )
  );
};

const LoginPageStyled = styled.div`
  .loginStack {
    height: 100vh;
  }
  .loginWrap {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    width: 900px;
    justify-content: space-evenly;
    .loginWrap__left {
      text-align: center;
      width: 450px;
      .loginWrap__subtitle {
        margin-top: 1rem;
        font-size: 12px;
        color: gray;
      }
      .loginWrap__title {
        h2 {
          margin-top: 0.25rem;
        }
      }
      .loginWrap__logos {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        .loginWrap__logo {
          width: 64px;
        }
      }
      .loginWrap__image {
        width: 100%;
      }
      .loginWrap__footer {
        margin-bottom: 30px;
        .loginWrap__footer__line {
          margin: 10px auto 20px auto;
          background: #e5e5e5;
          width: 50px;
          height: 1px;
        }
        .loginWrap__footer__text {
          font-size: 12px;
          color: gray;
        }
      }
    }
    .loginWrap__right {
      width: 350px;
      input {
        margin-bottom: 0.5rem;
      }
      button {
        margin-top: 1rem;
      }
    }
  }
`;

export default LoginPage;
