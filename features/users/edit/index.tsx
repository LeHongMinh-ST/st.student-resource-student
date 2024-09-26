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
  Skeleton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconDeviceFloppy, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { dashboardRoute, userRoute } from '@/routes';
import { useUserService } from '@/services/userService';
import { User } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import { RoleSelectList } from '@/constants/commons';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import Role from '@/enums/role.enum';

const UserUpdatePage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<User>({
    defaultValues: {
      role: Role.Admin,
    },
  });
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const { updateUser, getUser } = useUserService();
  const { query } = useRouter();
  const { id } = query;

  useEffect(() => {
    if (id) {
      setIsFetching(true);
      getUser(Number(id))
        .then((res) => {
          reset(res.data.data);
        })
        .finally(() => setIsFetching(false));
    }
  }, [id, reset]);

  const onSubmit = async (data: User) => {
    if (!isSubmitting) {
      try {
        const res = await updateUser(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Cập nhật người dùng thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
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
    <UserUpdatePageStyled>
      <Container fluid>
        <Stack gap="lg">
          <Skeleton visible={isFetching}>
            <PageHeader
              title={`Tài khoản - Chỉnh sửa - #${id}`}
              breadcrumbItems={[
                { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
                { title: 'Tài khoản', href: userRoute.list },
                { title: 'Chỉnh sửa', href: null },
              ]}
              withActions={
                <Button
                  component={Link}
                  href={userRoute.list}
                  leftSection={<IconLogout size={18} />}
                >
                  Quay lại
                </Button>
              }
            />
          </Skeleton>
          <Paper p="md" shadow="md" radius="md">
            <Grid gutter={{ base: 'lg', lg: 'xl' }}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                  <Stack gap={32}>
                    <Fieldset legend="Thông tin tài khoản">
                      <Stack>
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                          <Skeleton visible={isFetching}>
                            <TextInput
                              withAsterisk
                              label="Họ đệm"
                              placeholder="Họ đệm"
                              {...register('last_name', {
                                required: ERROR_MESSAGES.user.last_name.required,
                              })}
                              error={errors.last_name?.message}
                            />
                          </Skeleton>
                          <Skeleton visible={isFetching}>
                            <TextInput
                              withAsterisk
                              label="Tên"
                              placeholder="Tên"
                              {...register('first_name', {
                                required: ERROR_MESSAGES.user.first_name.required,
                              })}
                              error={errors.first_name?.message}
                            />
                          </Skeleton>
                        </SimpleGrid>
                        <Skeleton visible={isFetching}>
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
                        </Skeleton>
                        <Skeleton visible={isFetching}>
                          <TextInput
                            withAsterisk
                            label="Tên đăng nhập"
                            placeholder="Tên đăng nhập"
                            {...register('user_name', {
                              required: ERROR_MESSAGES.user.user_name.required,
                            })}
                            error={errors.user_name?.message}
                          />
                        </Skeleton>
                        <Skeleton visible={isFetching}>
                          <TextInput
                            label="Số điện thoại"
                            placeholder="Số điện thoại"
                            {...register('phone')}
                            error={errors.phone?.message}
                          />
                        </Skeleton>
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
                        <Skeleton visible={isFetching}>
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
                        </Skeleton>
                        {getValues('role') === Role.Teacher && (
                          <Skeleton visible={isFetching}>
                            <TextInput
                              withAsterisk
                              label="Mã giảng viên"
                              placeholder="Mã giảng viên"
                              {...register('code', {
                                required: ERROR_MESSAGES.user.last_name.required,
                              })}
                              error={errors.code?.message}
                            />
                          </Skeleton>
                        )}
                      </Stack>
                    </Fieldset>
                  </Stack>
                </Surface>
              </Grid.Col>
            </Grid>
            <Surface mt="lg">
              <Skeleton width="5%" visible={isFetching}>
                <Button
                  loading={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  leftSection={<IconDeviceFloppy size={18} />}
                >
                  Lưu
                </Button>
              </Skeleton>
            </Surface>
          </Paper>
        </Stack>
      </Container>
    </UserUpdatePageStyled>
  );
};

const UserUpdatePageStyled = styled.div``;

export default UserUpdatePage;
