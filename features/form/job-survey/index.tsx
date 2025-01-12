import styled from '@emotion/styled';
import {
  Card,
  Text,
  TextInput,
  Button,
  Select,
  Radio,
  Image,
  Checkbox,
  LoadingOverlay,
} from '@mantine/core';
import { IconCalendar, IconSend, IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import 'dayjs/locale/vi';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { useDisclosure } from '@mantine/hooks';
import { GenderSelectList } from '@/constants/commons';
import { ANSWER_EMPLOYMENT_STATUS, LIST_OPTION_QUESTION_FORM } from '@/constants/form';
import { FormJobSurvey, IOptionCheckbox, SelectList } from '@/types';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { formatDateString } from '@/utils/func/formatDateString';
import HttpStatus from '@/enums/http-status.enum';
import { useEmploymentSurveyResponse } from '@/services/employmentSurveyResponseService';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';
import { useTrainingIndustryService } from '@/services/trainingIndustryService';
import { useCityService } from '@/services/cityService';
import { useStudentService } from '@/services/studentService';
import Completed from '@/features/form/job-survey/compoents/Completed';
import ConfirmModal from '@/components/Modals/ConfirmModel/ConfirmModal';
import InfoModal from './compoents/InfoModal';
import ConfirmInfoModal from './compoents/ConfirmInfo';

const JobSurveyPage = () => {
  const surveyPeriodService = useSurveyPeriodService();
  const trainingIndustryService = useTrainingIndustryService();
  const studentService = useStudentService();
  const cityService = useCityService();
  const router = useRouter();
  const { id, code } = router.query;

  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormJobSurvey>({
    defaultValues: {},
  });

  const [studentCode, setStudentCode] = useState('');

  const { createResponse, getResponse, updateResponse } = useEmploymentSurveyResponse();
  const handleGetResponse = ({
    studentCode,
    surveyPeriodId,
    code_verify,
  }: {
    studentCode?: string;
    surveyPeriodId: number;
    code_verify?: string | undefined;
  }) =>
    getResponse({
      // student_code: studentCode ?? getValues('code_student'),
      ...((studentCode ?? getValues('code_student')) && {
        student_code: studentCode ?? getValues('code_student'),
      }),
      survey_period_id: surveyPeriodId,
      ...(code_verify && { code_verify: String(code_verify) }),
      // code_verify,
    }).then((res) => {
      const result = res.data.data;
      if (result?.code_student) {
        onOpen();
      }
      return result;
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [studentSearchKey] = useState('');

  const isStudentCodeLongEnough = studentSearchKey.length >= 6;
  const isCodeLongEnough = studentCode.length >= 6;

  const { data: dataSurveyResponse, isLoading: isLoadingSurveyResponse } = useSWR<any>(
    code || isCodeLongEnough ? [studentCode, code, id] : null,
    () =>
      handleGetResponse({
        studentCode,
        surveyPeriodId: Number(id),
        code_verify: code ? String(code) : undefined,
      }),
    {
      revalidateOnFocus: false,
    }
  );

  const [dataOptionTrainingIndustries, setDataOptionTrainingIndustries] = useState<
    SelectList<string>[]
  >([]);

  const [dataOptionCities, setDataOptionCities] = useState<SelectList<string>[]>([]);

  const handleGetStudent = () =>
    studentService
      .getStudent({
        ...(code && { code_verify: String(code) }),
        code: studentSearchKey,
      })
      .then((res) => res.data.data);

  const handleTrainingIndustryRes = () => {
    if (surveyPeriod?.faculty_id) {
      return trainingIndustryService
        .getList({
          faculty_id: surveyPeriod?.faculty_id,
        })
        .then((res) => res?.data?.data);
    }
    return null;
  };

  const handleGetSurveyPeriodService = () =>
    surveyPeriodService
      .getSurveyPeriod(String(id))
      .then((res) => {
        if (res?.data?.data?.end_date && dayjs().isAfter(dayjs(res.data.data.end_date))) {
          setDescriptionErrorModal(
            `Đợt khảo sát tình hình việc làm của sinh viên tốt nghiệp năm ${res.data.data.year} đã kết thúc vào ${formatDateString(res.data.data.end_date, 'HH:MM dd/mm/yyyy')}.`
          );
        }
        return res;
      })
      .then((res) => res.data.data)
      .catch(() => {
        setDescriptionErrorModal('Đợt khảo sát không tồn tại!');
      });

  const { data: surveyPeriod, isLoading } = useSWR([id], handleGetSurveyPeriodService);

  const { data: trainingIndustryRes, isLoading: isLoadingTrainingIndustryRes } = useSWR(
    [surveyPeriod?.faculty_id],
    handleTrainingIndustryRes
  );

  useEffect(() => {
    const data = (trainingIndustryRes ?? [])?.map((item) => ({
      label: item.name,
      value: String(item.id),
    }));
    setDataOptionTrainingIndustries(() => data ?? []);
  }, [trainingIndustryRes]);

  const handleGetCityRes = () => cityService.getList().then((res) => res.data.data);
  const { data: cityData, isLoading: isLoadingCity } = useSWR('cityData', handleGetCityRes);

  useEffect(() => {
    const data = cityData?.map((item) => ({
      label: item.name,
      value: String(item.id),
    }));
    setDataOptionCities(() => data ?? []);
  }, [cityData]);

  const { data: studentData, isLoading: isLoadingStudentData } = useSWR(
    code || isStudentCodeLongEnough ? [code, studentSearchKey] : null,
    handleGetStudent,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (studentData) {
      reset({
        code_student: studentData?.code ?? '',
        full_name: studentData?.full_name ?? '',
        dob: dayjs(studentData?.info?.dob).format('MM/DD/YYYY') ?? '',
        phone_number: studentData?.info?.phone ?? '',
        email: studentData?.graduate?.email ?? '',
        course: `K${studentData?.code?.slice(0, 2) ?? ''}`,
        identification_card_number: studentData?.info?.citizen_identification ?? '',
      });

      if (studentData?.training_industry_id) {
        setValue('training_industry_id', String(studentData?.training_industry_id));
      }
      if (studentData?.info?.gender) {
        setValue('gender', studentData?.info?.gender);
      }
    }
  }, [studentData]);

  const [descriptionErrorModal, setDescriptionErrorModal] = useState('');

  const resetForm = () => {
    reset({
      code_student: null,
      full_name: null,
      dob: null,
      phone_number: null,
      email: null,
      course: null,
      identification_card_number: null,
      identification_card_number_update: null,
      identification_issuance_place: null,
      identification_issuance_date: null,
      training_industry_id: null,
      employment_status: null,
      recruit_partner_name: null,
      recruit_partner_address: null,
      recruit_partner_date: null,
      recruit_partner_position: null,
      work_area: null,
      employed_since: null,
      trained_field: null,
      professional_qualification_field: null,
      level_knowledge_acquired: null,
      starting_salary: null,
      average_income: null,
      job_search_method: { value: [] },
      recruitment_type: { value: [] },
      soft_skills_required: { value: [] },
      must_attended_courses: { value: [] },
      solutions_get_job: { value: [] },
    } as unknown as FormJobSurvey);
  };

  const checkValueInArrayCheckbox = (
    fieldName: keyof FormJobSurvey,
    value: string | number
  ): boolean => {
    const fieldValues = (getValues(fieldName) as IOptionCheckbox)?.value || [];

    if (
      typeof value === 'string' &&
      Array.isArray(fieldValues) &&
      fieldValues.every((item) => typeof item === 'string')
    ) {
      return (fieldValues as string[]).includes(value);
    }

    if (
      typeof value === 'number' &&
      Array.isArray(fieldValues) &&
      fieldValues.every((item) => typeof item === 'number')
    ) {
      return (fieldValues as number[]).includes(value);
    }

    return false;
  };

  const setCheckboxValue = (fieldName: keyof FormJobSurvey, valueCheckbox: string[]): void => {
    const valueForm = getValues(fieldName) as IOptionCheckbox;
    setValue(fieldName, {
      ...valueForm,
      value: valueCheckbox.map((e) => String(e)),
    } as IOptionCheckbox);
    trigger(fieldName);
  };

  const setOtherContent = (fieldName: keyof FormJobSurvey, value: string): void => {
    const valueForm = getValues(fieldName) as IOptionCheckbox;
    setValue(fieldName, { ...valueForm, content_other: value } as IOptionCheckbox);
    trigger(fieldName);
  };

  const setRadioValue = (fieldName: keyof FormJobSurvey, value: string | number): void => {
    setValue(fieldName, String(value));
    trigger(fieldName);
  };

  const onSubmitForm = async (data: FormJobSurvey) => {
    if (!data.employment_status) {
      setError('employment_status', { message: 'Vui lòng chọn tình trạng việc làm' });
      return;
    }

    if (!isSubmitting) {
      try {
        if (surveyPeriod?.id !== undefined) {
          data.survey_period_id = surveyPeriod?.id;
        } else {
          throw new Error('Survey period ID is undefined');
        }
        data.dob = formatDateString(data.dob, 'yyyy-mm-dd');
        data.identification_issuance_date = formatDateString(
          data.identification_issuance_date,
          'yyyy-mm-dd'
        );
        if (!data.identification_card_number_update?.trim()) {
          delete data.identification_card_number_update;
        }
        if (data.recruit_partner_date) {
          data.recruit_partner_date = formatDateString(data.recruit_partner_date, 'yyyy-mm-dd');
        }

        let res = null;
        if (dataSurveyResponse?.id) {
          const {
            gender,
            dob,
            identification_card_number,
            identification_issuance_date,
            identification_issuance_place,
            phone_number,
            email,
            ...updatedObject
          } = data;

          data = updatedObject;
          data.id = dataSurveyResponse.id;

          res = await updateResponse(data);
        } else {
          if (Number(data.employment_status) !== ANSWER_EMPLOYMENT_STATUS.employed) {
            const { code_student, full_name, gender, employment_status, solutions_get_job } = data;

            data = {
              code_student,
              full_name,
              gender,
              employment_status,
              solutions_get_job,
              survey_period_id: data.survey_period_id,
            };
          }
          res = await createResponse(data);
        }

        if (res) {
          setIsSuccess(true);
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

  const [isSuccess, setIsSuccess] = useState(false);

  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);

  // eslint-disable-next-line consistent-return
  const handleGetResponseNew = useCallback(async () => {
    if (dataSurveyResponse) {
      const {
        code_student,
        full_name,
        email,
        phone_number,
        dob,
        course,
        identification_card_number,
        identification_issuance_date,
        identification_issuance_place,
        gender,
        solutions_get_job,
        training_industry_id,
        recruit_partner_name,
        recruit_partner_address,
        recruit_partner_date,
        recruit_partner_position,
        city_work_id,
        work_area,
        employed_since,
        trained_field,
        professional_qualification_field,
        level_knowledge_acquired,
        starting_salary,
        average_income,
        job_search_method,
        recruitment_type,
        soft_skills_required,
        must_attended_courses,
      } = dataSurveyResponse;
      reset({
        code_student,
        full_name,
        email,
        phone_number,
        dob,
        course,
        identification_card_number,
        identification_issuance_date,
        identification_issuance_place,
        recruit_partner_name,
        recruit_partner_address,
        recruit_partner_date,
        recruit_partner_position,
        starting_salary,
      });
      setValue('gender', gender);
      setValue('course', `K${code_student?.slice(0, 2)}`);
      setValue('employment_status', String(dataSurveyResponse.employment_status));
      if (city_work_id) {
        setValue('city_work_id', String(city_work_id));
      }
      if (training_industry_id) {
        setValue('training_industry_id', String(training_industry_id));
      }
      if (work_area) {
        setValue('work_area', String(work_area));
      }
      if (employed_since) {
        setValue('employed_since', String(employed_since));
      }
      if (trained_field) {
        setValue('trained_field', String(trained_field));
      }
      if (professional_qualification_field) {
        setValue('professional_qualification_field', String(professional_qualification_field));
      }
      if (level_knowledge_acquired) {
        setValue('level_knowledge_acquired', String(level_knowledge_acquired));
      }
      if (average_income) {
        setValue('average_income', String(average_income));
      }

      setValue('solutions_get_job', {
        value: solutions_get_job.value as string[],
        content_other: solutions_get_job.content_other,
      });
      if (job_search_method?.value) {
        setValue('job_search_method', {
          value: job_search_method.value as string[],
          content_other: job_search_method.content_other,
        });
      }
      setValue('recruitment_type', {
        value: recruitment_type?.value as string[],
        content_other: recruitment_type?.content_other,
      });
      setValue('soft_skills_required', {
        value: soft_skills_required?.value as string[],
        content_other: soft_skills_required?.content_other,
      });
      setValue('must_attended_courses', {
        value: must_attended_courses?.value as string[],
        content_other: must_attended_courses?.content_other,
      });
      setValue('solutions_get_job', {
        value: solutions_get_job.value as string[],
        content_other: solutions_get_job.content_other,
      });
    }
    onClose();
  }, [surveyPeriodService]);

  const handleSetDataVerify = useCallback(async (data: any) => {
    if (data) {
      setValue('gender', data?.gender);
      setValue('full_name', data?.full_name);
      setValue('code_student', data?.code);
      setValue('course', `K${data?.code?.slice(0, 2)}`);
      console.log(`K${data?.code?.slice(0, 2)}`);

      setStudentCode(data?.code);
    }
  }, []);

  if (isSuccess) {
    return <Completed />;
  }
  return (
    <JobSurveyPageStyled>
      <ConfirmModal
        entityName="Thông báo"
        onConfirm={handleGetResponseNew}
        isOpen={isOpen}
        onClose={() => {
          setIsSuccess(true);
          onClose();
        }}
      />
      <ConfirmInfoModal
        surveyPeriodId={Number(id)}
        callbackSetStudentData={handleSetDataVerify}
        entityName={getValues('code_student')}
        description="Vui lòng xác nhận thông tin trước khi phản hồi khảo sát. Xác nhận thông tin bằng cách điền mã sinh viên và một thông tin khác"
        isOpen={!code && !getValues('code_student') && !dataSurveyResponse?.id}
        dataOptionTrainingIndustries={dataOptionTrainingIndustries}
      />
      <InfoModal
        entityName="Thông báo"
        isOpen={Boolean(descriptionErrorModal.length)}
        description={descriptionErrorModal}
      />
      <LoadingOverlay
        visible={
          isLoading ||
          isLoadingCity ||
          isLoadingTrainingIndustryRes ||
          isLoadingStudentData ||
          isSubmitting ||
          isLoadingSurveyResponse
        }
        zIndex={1000}
        overlayProps={{ blur: 2 }}
      />
      <div className="form-wrap">
        <Card shadow="sm" padding="lg" mb="lg">
          <div className="wrap-header">
            <div className="wrap-logo-header">
              <Image src="/images/logo-vnua.png" alt="logo" className="wrap-logo" />
            </div>
            <div className="wrap-info-header">
              <Text fw={100} ta="right" mb={20}></Text>
              <div className="wrap-title">
                <Text size="lg">BỘ NÔNG NGHIỆP</Text>
                <Text size="lg">VÀ PHÁT TRIỂN NÔNG THÔN</Text>
                <Text fw={600} size="lg">
                  HỌC VIỆN NÔNG NGHIỆP VIỆT NAM
                </Text>
                <Text fw={500} size="lg">
                  Thị trấn Trâu Quỳ, huyện Gia Lâm, thành phố Hà Nội Điện thoại: 024.62617586 - Fax:
                  024.62617586
                </Text>
              </div>
            </div>
          </div>
          <Text fw={700} size="xl" ta="center">
            {surveyPeriod?.title}
          </Text>
          <Text size="sm" my={10}>
            {surveyPeriod?.description}
          </Text>
          <Text mt="xs" size="sm">
            Thời gian khảo sát từ ngày{' '}
            <b>{formatDateString(surveyPeriod?.start_date, 'dd/mm/yyyy')}</b> đến ngày{' '}
            <b>{formatDateString(surveyPeriod?.end_date, 'dd/mm/yyyy')}</b>
          </Text>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="lg">
            Phần I: Thông tin cá nhân
          </Text>
        </Card>

        {dataSurveyResponse?.id ? (
          <>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                1. Mã sinh viên <span className="required text-red">*</span>
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                defaultValue={studentData?.code ?? ''}
                placeholder="vd: 637711"
                {...register('code_student', {
                  required: ERROR_MESSAGES.form_job.code_student.required,
                  onChange(event) {
                    setStudentCode(event.target.value);
                  },
                })}
                error={errors?.code_student?.message}
              />
            </Card>

            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                2. Họ và tên
                <span className="required text-red">*</span>
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                defaultValue={studentData?.last_name?.concat(' ', studentData?.first_name) ?? ''}
                placeholder="vd: Đào Đức Anh"
                {...register('full_name', {
                  required: ERROR_MESSAGES.form_job.full_name.required,
                })}
                error={errors?.full_name?.message}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                3. Cập nhập số căn cước công dân
              </Text>
              <TextInput
                variant="unstyled"
                placeholder="vd: 0334********"
                {...register('identification_card_number_update', {})}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                4. Khoá học
              </Text>
              <TextInput
                variant="unstyled"
                defaultValue={`K${studentData?.code?.slice(0, 2) ?? dataSurveyResponse?.code_student?.slice(0, 2) ?? ''}`}
                placeholder="vd: K63"
                {...register('course', {})}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                5. Tên ngành đào tạo
              </Text>
              <Select
                {...register('training_industry_id', {})}
                defaultValue={
                  dataSurveyResponse?.training_industry_id
                    ? String(dataSurveyResponse.training_industry_id)
                    : studentData?.training_industry_id
                      ? String(studentData.training_industry_id)
                      : ''
                }
                placeholder="Chọn ngành đào tạo"
                value={(getValues('training_industry_id') as string) ?? ''}
                onChange={(value) => {
                  if (value) {
                    // @ts-ignore
                    setValue('training_industry_id', value);
                    trigger('training_industry_id');
                  }
                }}
                data={dataOptionTrainingIndustries}
              />
            </Card>
          </>
        ) : (
          <>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                1. Mã sinh viên <span className="required text-red">*</span>
              </Text>
              <TextInput
                readOnly={!!code || !!getValues('code_student')}
                variant="unstyled"
                defaultValue={studentData?.code}
                placeholder="vd: 637711"
                {...register('code_student', {
                  required: ERROR_MESSAGES.form_job.code_student.required,
                  onChange(event) {
                    setStudentCode(event.target.value);
                  },
                })}
                error={errors?.code_student?.message}
              />
            </Card>

            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                2. Họ và tên <span className="required text-red">*</span>
              </Text>
              <TextInput
                readOnly
                variant="unstyled"
                defaultValue={studentData?.last_name?.concat(' ', studentData?.first_name) ?? ''}
                placeholder="vd: Đào Đức Anh"
                {...register('full_name', {
                  required: ERROR_MESSAGES.form_job.full_name.required,
                })}
                error={errors?.full_name?.message}
              />
            </Card>

            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                3. Giới tính <span className="required text-red">*</span>
              </Text>
              <Select
                {...register('gender', {
                  required: ERROR_MESSAGES.form_job.gender.required,
                })}
                placeholder="Chọn giới tính"
                readOnly={!!getValues('gender')}
                data={GenderSelectList}
                value={String(getValues('gender') ?? '')}
                onChange={(value) => {
                  if (value) {
                    // @ts-ignore
                    setValue('gender', value);
                    trigger('gender');
                  }
                }}
                error={errors?.gender?.message}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                4. Ngày sinh
              </Text>
              <DatePickerInput
                {...register('dob', {})}
                rightSection={
                  <IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />
                }
                placeholder="Chọn ngày sinh"
                locale="vi"
                valueFormat="DD/MM/YYYY"
                defaultValue={studentData?.info?.dob ? new Date(studentData?.info?.dob) : null}
                value={getValues('dob') ? new Date(getValues('dob') ?? '') : null}
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
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                5. Số căn cước công dân
              </Text>
              <TextInput
                variant="unstyled"
                placeholder="vd: 0334********"
                {...register('identification_card_number', {})}
              />
              <Text fw={600} size="sm" pt={10}>
                Ngày cấp
              </Text>
              <DatePickerInput
                {...register('identification_issuance_date', {})}
                rightSection={
                  <IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />
                }
                placeholder="DD/MM/YYYY"
                valueFormat="DD/MM/YYYY"
                locale="vi"
                value={
                  getValues('identification_issuance_date')
                    ? new Date(getValues('identification_issuance_date') ?? '')
                    : null
                }
                onChange={(value) => {
                  if (value) {
                    const formattedValue = formatDateString(value, 'mm/dd/yyyy');
                    setValue('identification_issuance_date', formattedValue);
                  } else {
                    setValue('identification_issuance_date', '');
                  }
                  trigger('identification_issuance_date');
                }}
              />
              <Text fw={600} size="sm" pt={10}>
                Nơi cấp
              </Text>
              <TextInput
                variant="unstyled"
                placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
                {...register('identification_issuance_place', {})}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                6. Khoá học
              </Text>
              <TextInput
                variant="unstyled"
                defaultValue={`K${studentData?.code?.slice(0, 2) || ''}`}
                placeholder="vd: K63"
                {...register('course', {})}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                7. Tên ngành đào tạo
              </Text>
              <Select
                {...register('training_industry_id', {})}
                defaultValue={
                  dataSurveyResponse?.training_industry_id
                    ? String(dataSurveyResponse.training_industry_id)
                    : studentData?.training_industry_id
                      ? String(studentData.training_industry_id)
                      : ''
                }
                placeholder="Chọn ngành đào tạo"
                value={(getValues('training_industry_id') as string) ?? ''}
                onChange={(value) => {
                  if (value) {
                    // @ts-ignore
                    setValue('training_industry_id', value);
                    trigger('training_industry_id');
                  }
                }}
                data={dataOptionTrainingIndustries}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                8. Điện thoại
              </Text>
              <TextInput
                defaultValue={studentData?.info?.phone ?? ''}
                variant="unstyled"
                placeholder="vd: 0333555****"
                {...register('phone_number', {})}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                9. Email
              </Text>
              <TextInput
                variant="unstyled"
                defaultValue={studentData?.graduate?.email ?? ''}
                placeholder="vd: abc@gmail.com"
                {...register('email', {})}
              />
            </Card>
          </>
        )}
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            <span>{dataSurveyResponse?.id ? 6 : 10}</span>. Anh/chị vui lòng cho biết tình trạng
            việc làm hiện tại của Anh/Chị <span className="required text-red">*</span>
          </Text>
          <Radio.Group
            value={getValues('employment_status')}
            onChange={(value) => {
              setRadioValue('employment_status', value);
              clearErrors('employment_status');
            }}
            error={errors.employment_status?.message}
          >
            {LIST_OPTION_QUESTION_FORM[1].map((item, index) => (
              <Radio mt="lg" key={index} value={String(item.value)} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
        {![
          String(ANSWER_EMPLOYMENT_STATUS.notLookingForJob),
          String(ANSWER_EMPLOYMENT_STATUS.advancedLearning),
          String(ANSWER_EMPLOYMENT_STATUS.unemployed),
        ].includes(watch('employment_status')) && (
          <>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 7 : 11}</span>. Tên đơn vị tuyển dụng{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <TextInput
                {...register('recruit_partner_name', {})}
                variant="unstyled"
                placeholder="vd: công ty TNHH A"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 8 : 12}</span>. Địa chỉ đơn vị{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <TextInput
                {...register('recruit_partner_address', {})}
                variant="unstyled"
                placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
              />
              <Text fw={600} size="sm" pt={20}>
                Địa chỉ đơn vị thuộc Tỉnh/Thành phố{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Select
                {...register('city_work_id', {
                  // ...([String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  //   watch('employment_status')
                  // ) && {
                  //   required: ERROR_MESSAGES.form_job.city_work_id.required,
                  // })
                })}
                placeholder="Chọn tỉnh/Thành phố"
                value={(getValues('city_work_id') as unknown as string) ?? ''}
                onChange={(value) => {
                  if (value) {
                    // @ts-ignore
                    setValue('city_work_id', value);
                    trigger('city_work_id');
                  }
                }}
                data={dataOptionCities}
                // error={[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                //   watch('employment_status')
                // ) ? errors.city_work_id?.message : 'false'}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 9 : 13}</span>. Thời gian tuyển dụng{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <DatePickerInput
                {...register('recruit_partner_date', {
                  // ...([String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  //   watch('employment_status')
                  // ) && {
                  //   required: ERROR_MESSAGES.form_job.identification_issuance_date.required,
                  // })
                })}
                rightSection={
                  <IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />
                }
                placeholder="DD/MM/YYYY"
                valueFormat="DD/MM/YYYY"
                locale="vi"
                value={
                  getValues('recruit_partner_date')
                    ? new Date(getValues('recruit_partner_date') ?? '')
                    : null
                }
                onChange={(value) => {
                  if (value) {
                    const formattedValue = formatDateString(value, 'mm/dd/yyyy');
                    setValue('recruit_partner_date', formattedValue);
                  } else {
                    setValue('recruit_partner_date', '');
                  }
                  trigger('recruit_partner_date');
                }}
                // error={[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                //   watch('employment_status')
                // ) ? errors?.identification_issuance_date?.message : 'false'}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 10 : 14}</span>. Chức vụ, vị trí việc làm{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <TextInput
                {...register('recruit_partner_position', {})}
                variant="unstyled"
                placeholder="vd: Trưởng phòng sale"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="lg">
                Phần II: Nội dung khảo sát
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 11 : 15}</span>. Đơn vị Anh/Chị đang làm việc thuộc
                khu vực làm việc nào?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Radio.Group
                value={getValues('work_area') as unknown as string} // Make sure to add this key in your form state
                onChange={(value) => setRadioValue('work_area', value)}
              >
                {LIST_OPTION_QUESTION_FORM[2].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 12 : 16}</span>. Sau khi tốt nghiệp, Anh/Chị có việc
                làm từ khi nào?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Radio.Group
                value={getValues('employed_since') as unknown as string}
                onChange={(value) => setRadioValue('employed_since', value)}
              >
                {LIST_OPTION_QUESTION_FORM[3].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 13 : 17}</span>. Công việc Anh/Chị đang đảm nhận có
                phù hợp với ngành được đào tạo không?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Radio.Group
                value={getValues('trained_field') as unknown as string}
                onChange={(value) => setRadioValue('trained_field', value)}
              >
                {LIST_OPTION_QUESTION_FORM[4].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 14 : 18}</span>. Công việc Anh/Chị đang đảm nhận có
                phù hợp với trình độ chuyên môn không?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Radio.Group
                value={getValues('professional_qualification_field') as unknown as string}
                onChange={(value) => setRadioValue('professional_qualification_field', value)}
                error={errors?.trained_field?.message}
              >
                {LIST_OPTION_QUESTION_FORM[5].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 15 : 19}</span>. Anh/chị có học được các kiến thức
                và kỹ năng cần thiết từ nhà trường cho công việc theo ngành tốt nghiệp không?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Radio.Group
                value={getValues('level_knowledge_acquired') as unknown as string}
                onChange={(value) => setRadioValue('level_knowledge_acquired', value)}
                error={errors?.level_knowledge_acquired?.message}
              >
                {LIST_OPTION_QUESTION_FORM[6].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 16 : 20}</span>. Mức lương khởi điểm của Anh/Chị
                (đơn vị triệu đồng/1 tháng){' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <TextInput {...register('starting_salary', {})} variant="unstyled" placeholder="15" />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 17 : 21}</span>. Mức thu nhập bình quân/tháng tính
                theo VNĐ của Anh/Chị hiện nay?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Radio.Group
                value={getValues('average_income') as unknown as string}
                onChange={(value) => setRadioValue('average_income', value)}
              >
                {LIST_OPTION_QUESTION_FORM[7].map((item) => (
                  <Radio
                    key={item.value}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Radio>
                ))}
              </Radio.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 18 : 22}</span>. Anh/Chị tìm được việc làm thông qua
                những hình thức nào? (Có thể có nhiều lựa chọn){' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Checkbox.Group
                value={getValues('job_search_method')?.value}
                onChange={(value) => setCheckboxValue('job_search_method', value)}
              >
                {LIST_OPTION_QUESTION_FORM[8].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    checked={checkValueInArrayCheckbox('job_search_method', item.value)}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {watch('job_search_method')?.value?.includes('0') && (
                  <TextInput
                    mt="sm"
                    variant="unstyled"
                    value={getValues('job_search_method')?.content_other}
                    onChange={(e) => setOtherContent('job_search_method', e.target.value)}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 19 : 23}</span>. Anh/chị được tuyển dụng theo hình
                thức nào?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Checkbox.Group
                value={getValues('recruitment_type')?.value}
                onChange={(value) => setCheckboxValue('recruitment_type', value)}
              >
                {LIST_OPTION_QUESTION_FORM[9].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    checked={checkValueInArrayCheckbox('recruitment_type', item.value)}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {watch('recruitment_type')?.value?.includes('0') && (
                  <TextInput
                    mt="sm"
                    variant="unstyled"
                    value={getValues('recruitment_type')?.content_other}
                    onChange={(e) => setOtherContent('recruitment_type', e.target.value)}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 20 : 24}</span>. Trong quá trình làm việc, Anh/Chị
                cần những kỹ năng mềm nào sau đây?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Checkbox.Group
                value={getValues('soft_skills_required')?.value}
                onChange={(value) => setCheckboxValue('soft_skills_required', value)}
              >
                {LIST_OPTION_QUESTION_FORM[10].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    checked={checkValueInArrayCheckbox('soft_skills_required', item.value)}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {watch('soft_skills_required')?.value?.includes('0') && (
                  <TextInput
                    mt="sm"
                    variant="unstyled"
                    value={getValues('soft_skills_required')?.content_other}
                    onChange={(e) => setOtherContent('soft_skills_required', e.target.value)}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                <span>{dataSurveyResponse?.id ? 21 : 25}</span>. Sau khi được tuyển dụng, Anh/Chị có
                phải tham gia khóa học nâng cao nào dưới đây để đáp ứng công việc không?{' '}
                {[String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(
                  watch('employment_status')
                ) ? (
                  <span className="required">*</span>
                ) : (
                  <></>
                )}
              </Text>
              <Checkbox.Group
                onChange={(value) => setCheckboxValue('must_attended_courses', value)}
                error={errors?.must_attended_courses?.message}
                value={getValues('must_attended_courses')?.value}
              >
                {LIST_OPTION_QUESTION_FORM[11].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    checked={checkValueInArrayCheckbox('must_attended_courses', item.value)}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {watch('must_attended_courses')?.value?.includes('0') && (
                  <TextInput
                    mt="sm"
                    variant="unstyled"
                    value={getValues('must_attended_courses')?.content_other}
                    onChange={(e) => setOtherContent('must_attended_courses', e.target.value)}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
          </>
        )}
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            <span>
              {dataSurveyResponse?.id
                ? [String(ANSWER_EMPLOYMENT_STATUS.employed)].includes(watch('employment_status'))
                  ? 22
                  : 7
                : [
                      String(ANSWER_EMPLOYMENT_STATUS.notLookingForJob),
                      String(ANSWER_EMPLOYMENT_STATUS.advancedLearning),
                      String(ANSWER_EMPLOYMENT_STATUS.unemployed),
                    ].includes(watch('employment_status'))
                  ? 11
                  : 26}
            </span>
            . Theo Anh/Chị, những giải pháp nào sau đây giúp tăng tỷ lệ có việc làm đúng ngành của
            sinh viên tốt nghiệp từ chương trình đào tạo mà Anh/Chị đã học?
            <span className="required">*</span>
          </Text>
          <Checkbox.Group
            onChange={(value) => setCheckboxValue('solutions_get_job', value)}
            error={errors?.solutions_get_job?.message}
            value={getValues('solutions_get_job')?.value}
          >
            {LIST_OPTION_QUESTION_FORM[12]?.map((item, index) => (
              <Checkbox
                key={index}
                checked={checkValueInArrayCheckbox('solutions_get_job', item.value)}
                mt="lg"
                value={String(item.value)}
                label={item.label}
              ></Checkbox>
            ))}
            <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
            {watch('solutions_get_job')?.value?.includes('0') && (
              <TextInput
                mt="sm"
                variant="unstyled"
                value={getValues('solutions_get_job')?.content_other}
                onChange={(e) => setOtherContent('solutions_get_job', e.target.value)}
                placeholder="Nhập lựa chọn khác"
              />
            )}
          </Checkbox.Group>
        </Card>
        <div className="form-button">
          <Button onClick={handleSubmit(onSubmitForm)} leftSection={<IconSend size={14} />}>
            Gửi
          </Button>
          <Button
            onClick={() => resetForm()}
            leftSection={<IconTrash size={14} />}
            variant="default"
          >
            Xoá hết câu trả lời
          </Button>
        </div>
      </div>
      <div className="form-footer">
        <div className="copyright">Copyright 2023 © ST Team All Rights Reserved.</div>
      </div>
    </JobSurveyPageStyled>
  );
};

const JobSurveyPageStyled = styled.div`
  height: 100vh;
  background: #e3edfd;
  padding: 0 20px 20px 20px;
  overflow-y: auto;

  .form-wrap {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;

    .wrap-header {
      display: flex;
      justify-content: space-between;
      margin: 0 20px 20px 20px;

      .wrap-logo-header {
        display: flex;
        align-items: center;
        width: 40%;
        position: relative;

        .wrap-logo {
          padding-left: 20px;
          width: 65%;
          height: fit-content;
          position: absolute;
        }
      }

      .wrap-info-header {
        width: 60%;
        text-align: center;

        .wrap-title {
          display: flex;
          flex-direction: column;
        }
      }
    }

    .input-search {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 20px;
      flex-wrap: wrap;

      .mantine-TextInput-root {
        max-width: 400px;
        width: 100%;
      }
    }

    .required {
      color: #f95252 !important;
    }

    input.mantine-TextInput-input,
    input.mantine-Select-input,
    .mantine-DatePickerInput-input {
      border-bottom: 1px solid var(--mantine-color-gray-4);
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: unset;
      width: 100%;
    }

    .form-button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
  }

  .form-footer {
    margin-top: 20px;
    text-align: center;

    .copyright {
      color: var(--mantine-color-gray-7);
      font-size: 12px;
    }
  }
`;

export default JobSurveyPage;
