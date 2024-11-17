import styled from '@emotion/styled';
import {
  Card,
  Text,
  TextInput,
  Button,
  Select,
  Radio,
  Checkbox,
  LoadingOverlay,
} from '@mantine/core';
import {
  // IconSearch,
  IconCalendar,
  IconSend,
  IconTrash,
  // IconCheck,
  IconAlertTriangle,
} from '@tabler/icons-react';
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
    formState: { errors, isSubmitting },
  } = useForm<FormJobSurvey>({
    defaultValues: {},
  });

  const [studentCode, setStudentCode] = useState('');

  const { createResponse, getResponse } = useEmploymentSurveyResponse();
  const handleGetResponse = ({
    studentCode,
    surveyPeriodId,
    code_verify,
  }: {
    studentCode?: string;
    surveyPeriodId: number;
    code_verify?: string;
  }) =>
    getResponse({
      student_code: studentCode ?? getValues('code_student'),
      survey_period_id: surveyPeriodId,
      code_verify,
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

  const { data: dataSurveyResponse, isLoading: isLoadingSurveyResponse } = useSWR(
    code || isCodeLongEnough ? [studentCode, code, id] : null,
    () => handleGetResponse({ studentCode, surveyPeriodId: Number(id), code_verify: String(code) }),
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
    surveyPeriodService.getSurveyPeriod(String(id)).then((res) => res.data.data);

  const { data: surveyPeriod, isLoading } = useSWR([id], handleGetSurveyPeriodService);

  const { data: trainingIndustryRes, isLoading: isLoadingTrainingIndustryRes } = useSWR(
    surveyPeriod?.faculty_id ? String(surveyPeriod.faculty_id) : null,
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
        full_name: studentData?.last_name?.concat(' ', studentData?.first_name) ?? '',
        dob: dayjs(studentData?.info?.dob).format('MM/DD/YYYY') ?? '',
        phone_number: studentData?.info?.phone ?? '',
        email: studentData?.graduate?.email ?? '',
        course: `K${studentData?.code?.slice(0, 2) ?? ''}`,
        identification_card_number: studentData?.info?.citizen_identification ?? '',
      });
      console.log('training_industry_id', studentData?.training_industry_id);

      if (studentData?.training_industry_id) {
        setValue('training_industry_id', String(studentData?.training_industry_id));
      }
      if (studentData?.info?.gender) {
        setValue('gender', studentData?.info?.gender);
      }
    }
  }, [studentData]);

  // useEffect(() => {
  //   console.log('dataSurveyResponse', dataSurveyResponse);
  //   console.log('isOpen', isOpen);
  //   console.log('studentCode', studentCode);

  //   if (dataSurveyResponse) {
  //     const {
  //       code_student,
  //       full_name,
  //     } = dataSurveyResponse;

  //     reset({
  //       ...dataSurveyResponse,
  //       solutions_get_job: {
  //         value: ["1", "2"]
  //       }
  //       // dob: dayjs(info?.dob).format('MM/DD/YYYY') ?? '',
  //       // phone_number: info?.phone ?? '',
  //       // email: graduate?.email ?? '',
  //       // course: `K${code?.slice(0, 2) ?? ''}`,
  //       // gender: info?.gender ?? '',
  //       // identification_card_number: info?.citizen_identification ?? '',
  //       // training_industry_id: training_industry_id
  //       //   ? String(training_industry_id)
  //       //   : ''
  //     });
  //   }
  // }, [studentCode]);
  // const [inputSearchGenerate, setInputSearchGenerate] = useState('');

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
        const res = await createResponse(data);

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
          <Text fw={600} size="xl" ta="center">
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
        {/* <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={500} size="sm">
            (Mẹo) Tự động điền thông tin cá nhân
          </Text>
          <div className="input-search">
            <TextInput
              value={studentSearchKey}
              onChange={(e) => {
                setStudentSearchKey(e.target.value);
              }}
              variant="unstyled"
              placeholder="Nhập mã sinh viên, email hoặc số điện thoại"
            />
            <Button leftSection={<IconSearch size={14} />} variant="outline">
              Tìm kiếm
            </Button>
          </div>
        </Card> */}
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            1. Mã sinh viên <span className="required text-red">*</span>
          </Text>
          <TextInput
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
            2. Họ và tên <span className="required text-red">*</span>
          </Text>
          <TextInput
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
            4. Ngày sinh <span className="required text-red">*</span>
          </Text>
          <DatePickerInput
            {...register('dob', {
              required: ERROR_MESSAGES.form_job.dob.required,
            })}
            rightSection={<IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />}
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
            error={errors?.dob?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            5. Số căn cước công dân <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            placeholder="vd: 0334********"
            {...register('identification_card_number', {
              required: ERROR_MESSAGES.form_job.identification_card_number.required,
            })}
            error={errors?.identification_card_number?.message}
          />
          {watch('identification_card_number') && (
            <>
              <Text fw={600} size="sm" pt={10}>
                Cập nhập số căn cước công dân (nếu số căn cước công dân hiện tại chưa đúng)
              </Text>
              <TextInput
                variant="unstyled"
                placeholder="vd: 0334********"
                {...register('identification_card_number_update', {})}
              />
            </>
          )}
          <Text fw={600} size="sm" pt={10}>
            Ngày cấp <span className="required text-red">*</span>
          </Text>
          <DatePickerInput
            {...register('identification_issuance_date', {
              required: ERROR_MESSAGES.form_job.identification_issuance_date.required,
            })}
            rightSection={<IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />}
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
            error={errors?.identification_issuance_date?.message}
          />
          <Text fw={600} size="sm" pt={10}>
            Nơi cấp <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
            {...register('identification_issuance_place', {
              required: ERROR_MESSAGES.form_job.identification_issuance_place.required,
            })}
            error={errors?.identification_issuance_place?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            6. Khoá học <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            defaultValue={`K${studentData?.code?.slice(0, 2) ?? ''}`}
            placeholder="vd: K63"
            {...register('course', {
              required: ERROR_MESSAGES.form_job.course.required,
            })}
            error={errors?.course?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            7. Tên ngành đào tạo <span className="required text-red">*</span>
          </Text>
          <Select
            {...register('training_industry_id', {
              required: ERROR_MESSAGES.form_job.training_industry_id.required,
            })}
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
            error={errors.training_industry_id?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            8. Điện thoại <span className="required text-red">*</span>
          </Text>
          <TextInput
            defaultValue={studentData?.info?.phone ?? ''}
            variant="unstyled"
            placeholder="vd: 0333555****"
            {...register('phone_number', {
              required: ERROR_MESSAGES.form_job.phone_number.required,
            })}
            error={errors?.phone_number?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            9. Email <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            defaultValue={studentData?.graduate?.email ?? ''}
            placeholder="vd: abc@gmail.com"
            {...register('email', {
              required: ERROR_MESSAGES.form_job.email.required,
            })}
            error={errors?.email?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            10. Anh/chị vui lòng cho biết tình trạng việc làm hiện tại của Anh/Chị{' '}
            <span className="required text-red">*</span>
          </Text>
          <Radio.Group
            value={getValues('employment_status')}
            onChange={(value) => setRadioValue('employment_status', value)}
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
                11. Tên đơn vị tuyển dụng
              </Text>
              <TextInput
                {...register('recruit_partner_name', {})}
                variant="unstyled"
                placeholder="vd: công ty TNHH A"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                12. Địa chỉ đơn vị
              </Text>
              <TextInput
                {...register('recruit_partner_address', {})}
                variant="unstyled"
                placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
              />
              <Text fw={600} size="sm" pt={20}>
                Địa chỉ đơn vị thuộc Tỉnh/Thành phố
              </Text>
              <Select
                {...register('city_work_id', {
                  required: ERROR_MESSAGES.form_job.city_work_id.required,
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
                error={errors.city_work_id?.message}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                13. Thời gian tuyển dụng
              </Text>
              <DatePickerInput
                {...register('recruit_partner_date', {
                  required: ERROR_MESSAGES.form_job.identification_issuance_date.required,
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
                error={errors?.identification_issuance_date?.message}
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                14. Chức vụ, vị trí việc làm
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
                15. Đơn vị Anh/Chị đang làm việc thuộc khu vực làm việc nào?
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
                16. Sau khi tốt nghiệp, Anh/Chị có việc làm từ khi nào?
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
                17. Công việc Anh/Chị đang đảm nhận có phù hợp với ngành được đào tạo không?
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
                18. Công việc Anh/Chị đang đảm nhận có phù hợp với trình độ chuyên môn không?
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
                19. Anh/chị có học được các kiến thức và kỹ năng cần thiết từ nhà trường cho công
                việc theo ngành tốt nghiệp không?
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
                20. Mức lương khởi điểm của Anh/Chị (đơn vị triệu đồng/1 tháng)
              </Text>
              <TextInput {...register('starting_salary', {})} variant="unstyled" placeholder="15" />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                21. Mức thu nhập bình quân/tháng tính theo VNĐ của Anh/Chị hiện nay?
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
                22. Anh/Chị tìm được việc làm thông qua những hình thức nào? (Có thể có nhiều lựa
                chọn)
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
                23. Anh/chị được tuyển dụng theo hình thức nào?
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
                24. Trong quá trình làm việc, Anh/Chị cần những kỹ năng mềm nào sau đây? (Có thể có
                nhiều lựa chọn)
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
                25. Sau khi được tuyển dụng, Anh/Chị có phải tham gia khóa học nâng cao nào dưới đây
                để đáp ứng công việc không? <span className="required">*</span>
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
            {![
              String(ANSWER_EMPLOYMENT_STATUS.notLookingForJob),
              String(ANSWER_EMPLOYMENT_STATUS.advancedLearning),
              String(ANSWER_EMPLOYMENT_STATUS.unemployed),
            ].includes(watch('employment_status'))
              ? 26
              : 11}{' '}
            Theo Anh/Chị, những giải pháp nào sau đây giúp tăng tỷ lệ có việc làm đúng ngành của
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
    max-width: 700px;
    margin: 20px auto;

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
