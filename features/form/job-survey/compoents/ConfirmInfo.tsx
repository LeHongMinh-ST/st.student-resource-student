import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import {
  IconAlertTriangle,
  IconCalendar,
  IconCheck,
  IconInfoCircle,
  IconRosetteDiscountCheck,
} from '@tabler/icons-react';
import { Button, Grid, Modal, Paper, Select, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { Surface } from '@/components';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import HttpStatus from '@/enums/http-status.enum';
import { SelectList, StudentVerify } from '@/types';
import { formatDateString } from '@/utils/func/formatDateString';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';

type ConfirmInfoModalProps = {
  surveyPeriodId: number;
  entityName: string;
  description: string;
  isOpen: boolean;
  dataOptionTrainingIndustries: SelectList<string>[];
  callbackSetStudentData?: (data: any) => void;
};

export default function ConfirmInfoModal({
  surveyPeriodId,
  entityName,
  description,
  isOpen,
  dataOptionTrainingIndustries,
  callbackSetStudentData,
}: ConfirmInfoModalProps) {
  const {
    register,
    trigger,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentVerify>({
    defaultValues: {},
  });

  const { verifySurveyPeriodStudent } = useSurveyPeriodService();

  const onSubmit = async (data: StudentVerify) => {
    const filledFields = Object.values(data).filter((value) => value !== '');
    if (filledFields.length < 2) {
      notifications.show({
        title: 'Thông báo',
        message: 'Vui lòng điền ít nhất 2 trường thông tin',
        icon: <IconAlertTriangle />,
        color: 'yellow',
        autoClose: 5000,
      });
      return;
    }

    if (!isSubmitting) {
      try {
        if (data.dob) {
          const formattedValue = dayjs(data.dob).format('DD/MM/YYYY');
          data.dob = formattedValue;
        }
        const res = await verifySurveyPeriodStudent(surveyPeriodId, data);
        if (res?.data?.data) {
          notifications.show({
            title: 'Thành công!',
            message: 'Xác thực thông tin thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
          if (callbackSetStudentData) {
            callbackSetStudentData(res?.data?.data);
          }
        } else {
          notifications.show({
            title: 'Thất bại!',
            message: 'Xác thực thông tin thất bại',
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        }
        // Call api here
      } catch (e: any) {
        if (Object.keys(e?.response?.data?.errors).length > 0) {
          const key = Object.keys(e?.response?.data?.errors)[0];
          notifications.show({
            title: 'Thất bại!',
            message: e?.response?.data?.errors[key][0],
            icon: <IconAlertTriangle />,
            color: 'red',
            autoClose: 5000,
          });
        }

        if (e?.status === HttpStatus.HTTP_UNPROCESSABLE_ENTITY) {
          const errors = e.response?.data?.errors;

          if (errors) {
            // @ts-ignore
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
    <Modal
      opened={isOpen}
      onClose={() => {}}
      title={`${entityName}`}
      withCloseButton={false}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <IconInfoCircle color="blue" size={32} />
            <Text fw={600}>Xác nhận thông tin</Text>
          </div>
          <div>
            <Text fw={400} size="sm" pl={47}>
              {description}
            </Text>
          </div>
        </div>
      </Stack>
      <Stack gap="lg">
        <Grid gutter={{ base: 'lg', lg: 'xl' }}>
          <Grid.Col span={{ base: 12, md: 12 }}>
            <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
              <Stack>
                <Stack>
                  <TextInput
                    {...register('code', {
                      required: ERROR_MESSAGES.form_job.code_student.required,
                    })}
                    error={errors.code?.message}
                    withAsterisk
                    label="Mã sinh viên"
                    placeholder=""
                  />
                  <Text size="sm" mb={-12}>
                    Ngày sinh
                  </Text>
                  <DatePickerInput
                    clearable
                    {...register('dob', {})}
                    leftSection={
                      <IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />
                    }
                    placeholder="Chọn ngày sinh"
                    locale="vi"
                    valueFormat="DD/MM/YYYY"
                    maxDate={new Date()}
                    onChange={(value) => {
                      if (value) {
                        const formattedValue = formatDateString(value, 'mm/dd/yyyy');
                        setValue('dob', formattedValue);
                      } else {
                        setValue('dob', '');
                      }
                      trigger('dob');
                    }}
                  />
                  <Text size="sm" mb={-12}>
                    Ngành đào tạo
                  </Text>
                  <Select
                    {...register('training_industry_id', {})}
                    placeholder="Chọn ngành đào tạo"
                    onChange={(value) => {
                      if (value) {
                        // @ts-ignore
                        setValue('training_industry_id', value);
                        trigger('training_industry_id');
                      }
                    }}
                    data={dataOptionTrainingIndustries}
                  />
                  <TextInput
                    {...register('identification_card_number', {})}
                    label="Số CCCD hoặc CMND"
                    placeholder=""
                  />
                  <TextInput
                    {...register('phone_number', {})}
                    label="Số điện thoại"
                    placeholder=""
                  />
                  <TextInput {...register('email', {})} label="Email" placeholder="" />
                </Stack>
              </Stack>
            </Surface>
          </Grid.Col>
        </Grid>
        <Surface>
          <Button
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            leftSection={<IconRosetteDiscountCheck size={18} />}
          >
            Xác nhận
          </Button>
        </Surface>
      </Stack>
    </Modal>
  );
}
