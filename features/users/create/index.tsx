'use client';

import styled from '@emotion/styled';
import {
  Container,
  Stack,
  Button,
  Paper,
  Fieldset,
  Grid,
  Select,
  SimpleGrid,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { dashboardRoute, userRoute } from '@/routes';
import { useUserService } from '@/services/userService';
import { User } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { RoleSelectList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import Role from '@/enums/role.enum';

const UserCreatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<User>({
    defaultValues: {
      role: Role.Admin,
    },
  });

  const { createUser } = useUserService();
  const { push } = useRouter();

  const onSubmit = async (data: User) => {
    if (!isSubmitting) {
      try {
        const res = await createUser(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới người dùng thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          push(userRoute.update(res.data.data.id));
        }
      } catch (e: any) {
        if (e?.status === HttpStatus.HTTP_UNPROCESSABLE_ENTITY) {
          const errors = e.response?.data?.errors;

          if (errors) {
            setFormErrors(errors, setError);
          }
        }
        if (e?.status === HttpStatus.HTTP_INTERNAL_SERVER_ERROR) {
          notifications.show({
            title: 'Thất bại!',
            message: 'Có lỗi xảy ra! Vui lòng thử lại sau',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        }
      }
    }
  };

  return (
    <UserCreatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Tài khoản - Tạo mới"
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: 'Tài khoản', href: userRoute.list },
              { title: 'Tạo mới', href: null },
            ]}
            withActions={
              <Button component={Link} href={userRoute.list} leftSection={<IconLogout size={18} />}>
                Quay lại
              </Button>
            }
          />

          <Paper p="md" shadow="md" radius="md">
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack gap={32}>
                    <Fieldset legend="Thông tin tài khoản">
                      <Stack>
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                          <TextInput
                            withAsterisk
                            label="Họ đệm"
                            placeholder="Họ đệm"
                            {...register('last_name', {
                              required: ERROR_MESSAGES.user.last_name.required,
                            })}
                            error={errors.last_name?.message}
                          />
                          <TextInput
                            withAsterisk
                            label="Tên"
                            placeholder="Tên"
                            {...register('first_name', {
                              required: ERROR_MESSAGES.user.first_name.required,
                            })}
                            error={errors.first_name?.message}
                          />
                        </SimpleGrid>
                        <TextInput
                          withAsterisk
                          type="email"
                          label="Email"
                          placeholder="Email"
                          {...register('email', {
                            required: ERROR_MESSAGES.user.email.required,
                          })}
                          error={errors.email?.message}
                        />
                        <TextInput
                          withAsterisk
                          label="Tên đăng nhập"
                          placeholder="Tên đăng nhập"
                          {...register('user_name', {
                            required: ERROR_MESSAGES.user.user_name.required,
                          })}
                          error={errors.user_name?.message}
                        />
                        <TextInput
                          label="Số điện thoại"
                          placeholder="Số điện thoại"
                          {...register('phone')}
                          error={errors.phone?.message}
                        />
                      </Stack>
                    </Fieldset>
                  </Stack>
                </Surface>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }} h="100%">
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack justify="space-between" gap={16} h="100%">
                    <Fieldset legend="Vai trò">
                      <Stack>
                        <Select
                          withAsterisk
                          label="Vai trò người dùng"
                          placeholder="Chọn vai trò"
                          data={RoleSelectList}
                          value={getValues('role')}
                          onChange={(value) => {
                            if (value) {
                              // @ts-ignore
                              setValue('role', value);
                              trigger('role');
                            }
                          }}
                        />
                        {getValues('role') === Role.Teacher && (
                          <TextInput
                            withAsterisk
                            label="Mã giảng viên"
                            placeholder="Mã giảng viên"
                            {...register('code', {
                              required: ERROR_MESSAGES.user.last_name.required,
                            })}
                            error={errors.code?.message}
                          />
                        )}
                      </Stack>
                    </Fieldset>
                  </Stack>
                </Surface>
              </Grid.Col>
            </Grid>
            <Surface mt="lg">
              <Button
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                leftSection={<IconDeviceFloppy size={18} />}
              >
                Tạo
              </Button>
            </Surface>
          </Paper>
        </Stack>
      </Container>
    </UserCreatePageStyled>
  );
};

const UserCreatePageStyled = styled.div``;

export default UserCreatePage;
