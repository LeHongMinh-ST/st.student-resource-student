import styled from '@emotion/styled';
import {
  Button,
  Container,
  Divider,
  Fieldset,
  Grid,
  Paper,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCalendar,
  IconCheck,
  IconDeviceFloppy,
  IconLogout,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { DatePickerInput } from '@mantine/dates';
import { dashboardRoute, requestRoute } from '@/routes';
import { Family, Student, UpdateRequest } from '@/types';
import { setFormErrors } from '@/utils/func/formError';
import { PageHeader, Surface } from '@/components';
import HttpStatus from '@/enums/http-status.enum';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import {
  FamilyRelationshipList,
  GenderList,
  SocialPolicyObjectList,
  TrainingTypeList,
} from '@/constants/commons';
import { FamilyRelationship } from '@/enums';
import { useAuthStore } from '@/utils/recoil/auth/authState';
import { useRequestUpdateService } from '@/services/requestUpdateService';

const CreateRequestPage = () => {
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<Student>();

  const { push } = useRouter();
  const { authUser } = useAuthStore();

  if (authUser?.has_request_update) push(requestRoute.myRequest);
  const { createRequest } = useRequestUpdateService();
  useEffect(() => {
    if (authUser) {
      reset(authUser);
      setFamilyMembers(authUser?.families ?? []);
    }
  }, [authUser]);
  const [familyMembers, setFamilyMembers] = useState<Family[]>(authUser?.families || []);

  const handleAddFamilyMember = () => {
    const newFamilyMember: Family = {
      relationship: FamilyRelationship.Other,
      full_name: '',
      phone: '',
      job: '',
    };
    setFamilyMembers([...familyMembers, newFamilyMember]);
  };

  const handleRemoveFamilyMember = (index: number) => {
    const updatedFamilyMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedFamilyMembers);
    const resetData = { ...authUser };
    if (resetData) {
      resetData.families = updatedFamilyMembers;
      reset(resetData);
    }
  };

  const onSubmit = async (data: Student) => {
    const requestParams = {
      families: data?.families ?? [],
      person_email: data.info?.person_email,
      permanent_residence: data.info.permanent_residence,
      gender: data.info.gender,
      pob: data.info.pob,
      countryside: data.info.countryside,
      address: data.info.address,
      phone: data.info.phone,
      nationality: data.info.nationality,
      citizen_identification: data.info.citizen_identification,
      ethnic: data.info.ethnic,
      religion: data.info.religion,
      student_id: authUser?.id ?? 0,
    } as UpdateRequest;

    try {
      const res = await createRequest(requestParams);
      if (res) {
        notifications.show({
          title: 'Thành công!',
          message: 'Cập nhật thông tin sinh viên thành công',
          icon: <IconCheck />,
          color: 'green.8',
          autoClose: 5000,
        });

        push(requestRoute.myRequest);
      }
    } catch (e: any) {
      if (e?.status === HttpStatus.HTTP_UNPROCESSABLE_ENTITY) {
        const errors = e.response?.data?.errors;

        if (errors) {
          //@ts-ignore
          setFormErrors(errors, setError);
        }
      } else {
        notifications.show({
          title: 'Thất bại!',
          message: 'Có lỗi xảy ra! Vui lòng thử lại sau',
          icon: <IconAlertTriangle />,
          color: 'red',
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <StudentEditPageStyled>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title={`Yêu cầu chỉnh sửa - Tạo Yêu cầu - #${authUser?.code}`}
            breadcrumbItems={[
              { title: 'Bảng điều khiển', href: dashboardRoute.dashboard },
              { title: `Yêu cầu chỉnh sửa`, href: requestRoute.myRequest },
              { title: 'Tạo yêu cầu', href: null },
            ]}
            withActions={
              <Button
                onClick={() => push(requestRoute.myRequest)}
                leftSection={<IconLogout size={18} />}
              >
                Quay lại
              </Button>
            }
          />

          <Paper p="md" shadow="md" radius="md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Thông tin cá nhân">
                      <Stack>
                        <TextInput
                          withAsterisk
                          label="Mã sinh viên"
                          disabled
                          {...register('code', { required: ERROR_MESSAGES.student.code.required })}
                          error={errors.code?.message}
                        />
                        <TextInput
                          label="Email"
                          disabled
                          {...register('email', {
                            required: ERROR_MESSAGES.student.email.required,
                          })}
                          error={errors.email?.message}
                        />
                        <TextInput
                          withAsterisk
                          label="Họ và tên"
                          {...register('last_name', {
                            required: ERROR_MESSAGES.student.last_name.required,
                          })}
                          disabled
                        />
                        <TextInput
                          withAsterisk
                          label="Tên"
                          {...register('first_name', {
                            required: ERROR_MESSAGES.student.first_name.required,
                          })}
                          disabled
                        />

                        <TextInput
                          label="Email cá nhân"
                          {...register('info.person_email')}
                          error={errors.info?.person_email?.message}
                        />
                        <TextInput
                          label="Số điện thoại"
                          {...register('info.phone')}
                          error={errors.info?.phone?.message}
                        />

                        <TextInput
                          label="Số CMND/CCCD"
                          {...register('info.citizen_identification')}
                          error={errors.info?.citizen_identification?.message}
                        />
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Thông tin bổ sung">
                      <Stack>
                        <DatePickerInput
                          {...register('info.dob', {})}
                          rightSection={
                            <IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />
                          }
                          label="Ngày sinh"
                          placeholder="Chọn ngày sinh"
                          locale="vi"
                          valueFormat="DD/MM/YYYY"
                          defaultValue={authUser?.info?.dob ? new Date(authUser.info?.dob) : null}
                          value={
                            getValues('info.dob') ? new Date(getValues('info.dob') ?? '') : null
                          }
                          onChange={() => {}}
                          disabled
                        />
                        <Select
                          label="Giới tính"
                          data={GenderList}
                          disabled
                          value={getValues('info.gender')}
                        />

                        <Select
                          label="Loại hình đào tạo"
                          data={TrainingTypeList}
                          value={getValues('info.training_type')}
                          disabled
                        />
                        <Select
                          label="Chế độ chính sách"
                          data={SocialPolicyObjectList}
                          value={getValues('info.social_policy_object')}
                          disabled
                        />
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>
              </Grid>

              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 12 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Thông tin khác">
                      <Stack>
                        <TextInput
                          label="Địa chỉ"
                          {...register('info.address')}
                          error={errors.info?.address?.message}
                        />
                        <TextInput
                          label="Địa chỉ thường chú"
                          {...register('info.permanent_residence')}
                          error={errors.info?.permanent_residence?.message}
                        />
                        <TextInput
                          label="Nơi sinh"
                          {...register('info.pob')}
                          error={errors.info?.pob?.message}
                        />
                        <TextInput
                          label="Quê quán"
                          {...register('info.countryside')}
                          error={errors.info?.countryside?.message}
                        />
                        <Grid>
                          <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                              label="Dân tộc"
                              {...register('info.ethnic')}
                              error={errors.info?.ethnic?.message}
                            />
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                              label="Tôn giáo"
                              {...register('info.religion')}
                              error={errors.info?.religion?.message}
                            />
                          </Grid.Col>
                        </Grid>
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>
              </Grid>

              <Grid gutter={{ base: 'lg', lg: 'xl' }}>
                <Grid.Col span={{ base: 12, md: 12 }}>
                  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
                    <Fieldset legend="Thông tin gia đình">
                      <Stack>
                        {familyMembers?.map((familyMember: Family, index: number) => (
                          <div key={index}>
                            {index > 0 && <Divider style={{ marginBottom: '1rem' }} />}
                            <Grid>
                              <Grid.Col span={3}>
                                <Select
                                  label={`Người thân ${index + 1}`}
                                  data={FamilyRelationshipList}
                                  value={getValues(`families.${index}.relationship`)}
                                  onChange={(value) => {
                                    setValue(
                                      `families.${index}.relationship`,
                                      (value as FamilyRelationship) || FamilyRelationship.Other
                                    );
                                    trigger(`families.${index}.relationship`);
                                  }}
                                  error={errors.info?.gender?.message}
                                />
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <TextInput
                                  label="Tên"
                                  {...register(`families.${index}.full_name`, {
                                    required: ERROR_MESSAGES.family.full_name.required,
                                  })}
                                />
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <TextInput
                                  label="Số điện thoại"
                                  {...register(`families.${index}.phone`)}
                                />
                              </Grid.Col>
                              <Grid.Col span={3}>
                                <TextInput
                                  label="Nghề nghiệp"
                                  {...register(`families.${index}.job`)}
                                />
                              </Grid.Col>
                            </Grid>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                onClick={() => handleRemoveFamilyMember(index)}
                                style={{ marginTop: '1rem' }}
                                size="xs"
                                color="red"
                                className="mt-5"
                                leftSection={<IconTrash />}
                              >
                                Xoá
                              </Button>
                            </div>
                            <div style={{ marginBottom: '1rem' }} />
                          </div>
                        ))}
                        <div style={{ textAlign: 'right' }}>
                          <Button
                            style={{ maxWidth: '200px' }}
                            onClick={handleAddFamilyMember}
                            leftSection={<IconPlus />}
                          >
                            Thêm mới
                          </Button>
                        </div>
                      </Stack>
                    </Fieldset>
                  </Surface>
                </Grid.Col>
              </Grid>

              <Button
                className="mt-5"
                style={{ marginTop: '1rem' }}
                type="submit"
                loading={isSubmitting}
                leftSection={<IconDeviceFloppy size={18} />}
              >
                Tạo
              </Button>
            </form>
          </Paper>
        </Stack>
      </Container>
    </StudentEditPageStyled>
  );
};

const StudentEditPageStyled = styled.div``;

export default CreateRequestPage;
