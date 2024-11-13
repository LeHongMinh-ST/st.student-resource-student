import styled from '@emotion/styled';
import { Card, Text, TextInput, Button, Select, Radio, Checkbox } from '@mantine/core';
import {
  IconSearch,
  IconCalendar,
  IconSend,
  IconTrash,
  IconCheck,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import 'dayjs/locale/vi';
import { notifications } from '@mantine/notifications';
import { GenderSelectList } from '@/constants/commons';
import { ANSWER_EMPLOYMENT_STATUS, LIST_OPTION_QUESTION_FORM } from '@/constants/form';
import { FormJobSurvey, IOptionCheckbox, SurveyPeriod } from '@/types';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { formatDateString } from '@/utils/func/formatDateString';
import HttpStatus from '@/enums/http-status.enum';
import { useEmploymentSurveyResponse } from '@/services/employmentSurveyResponseService';

interface JobSurveyPageProps {
  surveyPeriod: SurveyPeriod; // Dữ liệu công việc, có thể không có
  dataOptionTrainingIndustries: [];
}

const JobSurveyPage = ({ surveyPeriod, dataOptionTrainingIndustries }: JobSurveyPageProps) => {
  const [inputSearchGenerate, setInputSearchGenerate] = useState('');
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormJobSurvey>({
    defaultValues: {},
  });

  const resetForm = () => {
    console.log(getValues('employment_status'));
    // setValue('employment_status', '')
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
    setValue(fieldName, { ...valueForm, value: valueCheckbox } as IOptionCheckbox);
    trigger(fieldName);
  };

  const setOtherContent = (fieldName: keyof FormJobSurvey, value: string): void => {
    const valueForm = getValues(fieldName) as IOptionCheckbox;
    setValue(fieldName, { ...valueForm, other_content: value } as IOptionCheckbox);
    trigger(fieldName);
  };

  const setRadioValue = (fieldName: keyof FormJobSurvey, value: string | number): void => {
    setValue(fieldName, String(value));
    trigger(fieldName);
  };

  const { createResponse } = useEmploymentSurveyResponse();

  const onSubmitForm = async (data: FormJobSurvey) => {
    if (!isSubmitting) {
      try {
        const res = await createResponse(data);
        if (res) {
          notifications.show({
            title: 'Thành công!',
            message: 'Tạo mới ngành đào tạo thành công',
            icon: <IconCheck />,
            color: 'green.8',
            autoClose: 5000,
          });
        }
        // Call api here
      } catch (e: any) {
        if (e?.status === HttpStatus.HTTP_UNPROCESSABLE_ENTITY) {
          const errors = e.response?.data?.errors;

          if (errors) {
            // @ts-ignore
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
    <JobSurveyPageStyled>
      <div className="form-wrap">
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="xl" ta="center">
            {surveyPeriod.title}
          </Text>
          <Text size="sm" my={10}>
            {surveyPeriod.description}
          </Text>
          <Text mt="xs" size="sm">
            Thời gian khảo sát từ ngày{' '}
            <b>{formatDateString(surveyPeriod.start_date, 'dd/mm/yyyy')}</b> đến ngày{' '}
            <b>{formatDateString(surveyPeriod.end_date, 'dd/mm/yyyy')}</b>
          </Text>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="lg">
            Phần I: Thông tin cá nhân
          </Text>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={500} size="sm">
            (Mẹo) Tự động điền thông tin cá nhân
          </Text>
          <div className="input-search">
            <TextInput
              value={inputSearchGenerate}
              onChange={(e) => setInputSearchGenerate(e.target.value)}
              variant="unstyled"
              placeholder="Nhập mã sinh viên, email hoặc số điện thoại"
            />
            <Button leftSection={<IconSearch size={14} />} variant="outline">
              Tìm kiếm
            </Button>
          </div>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            1. Mã sinh viên <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            placeholder="vd: 637711"
            {...register('code_student', {
              required: ERROR_MESSAGES.form_job.code_student.required,
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
            value={getValues('dob') ? new Date(getValues('dob') ?? '') : null}
            onChange={(value) => {
              if (value) {
                const formattedValue = value.toLocaleDateString('vi-VN');
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
        </Card>
        {watch('identification_card_number') && (
          <Card shadow="sm" padding="lg" mb="lg">
            <Text fw={600} size="sm">
              Cập nhập số căn cước công dân (nếu số căn cước công dân hiện tại chưa đúng)
            </Text>
            <TextInput
              variant="unstyled"
              placeholder="vd: 0334********"
              {...register('identification_card_number_update', {})}
            />
          </Card>
        )}
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            6. Ngày cấp <span className="required text-red">*</span>
          </Text>
          <DatePickerInput
            {...register('identification_issuance_place', {
              required: ERROR_MESSAGES.form_job.identification_issuance_place.required,
            })}
            rightSection={<IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />}
            placeholder="DD/MM/YYYY"
            valueFormat="DD/MM/YYYY"
            value={
              getValues('identification_issuance_place')
                ? new Date(getValues('identification_issuance_place') ?? '')
                : null
            }
            onChange={(value) => {
              if (value) {
                const formattedValue = value.toLocaleDateString('vi-VN');
                setValue('identification_issuance_place', formattedValue);
              } else {
                setValue('identification_issuance_place', '');
              }
              trigger('identification_issuance_place');
            }}
            error={errors?.identification_issuance_place?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            7. Nơi cấp <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
            {...register('identification_issuance_date', {
              required: ERROR_MESSAGES.form_job.identification_issuance_date.required,
            })}
            error={errors?.identification_issuance_date?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            8. Khoá học <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            placeholder="vd: K63"
            {...register('course', {
              required: ERROR_MESSAGES.form_job.course.required,
            })}
            error={errors?.course?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            9. Tên ngành đào tạo <span className="required text-red">*</span>
          </Text>
          <Select
            {...register('training_industry_id', {
              required: ERROR_MESSAGES.form_job.training_industry_id.required,
            })}
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
            10. Điện thoại <span className="required text-red">*</span>
          </Text>
          <TextInput
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
            11. Email <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            placeholder="vd: abc@gmail.com"
            {...register('email', {
              required: ERROR_MESSAGES.form_job.email.required,
            })}
            error={errors?.email?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            12. Anh/Chị vui lòng cho biết tình trạng việc làm hiện tại của Anh/Chị{' '}
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
        {watch('employment_status') === String(ANSWER_EMPLOYMENT_STATUS.employed) && (
          <>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                13. Cơ quan công tác
              </Text>
              <TextInput variant="unstyled" placeholder="vd: công ty TNHH A" />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                14. Địa chỉ cơ quan
              </Text>
              <TextInput
                variant="unstyled"
                placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
              />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                15. Tỉnh/Thành phố làm việc hiện tại
              </Text>
              <TextInput variant="unstyled" placeholder="vd: Hà Nội" />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                16. Chức vụ, vị trí việc làm
              </Text>
              <TextInput variant="unstyled" placeholder="vd: Trưởng phòng sale" />
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="lg">
                Phần II: Nội dung khảo sát
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                17. Đơn vị của anh chị đang làm việc thuộc khu vực làm việc nào?
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
                18. Sau khi tốt nghiệp, Anh/Chị có việc làm khi nào ?
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
                19. Công việc Anh/Chị đang đảm nhận có phù hợp với ngành được đào tạo không?
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
                20. Anh/chị có học được các kiến thức và kỹ năng cần thiết từ nhà trường cho công
                việc theo ngành tốt nghiệp không?
              </Text>
              <Radio.Group
                value={getValues('trained_field') as unknown as string}
                onChange={(value) => setRadioValue('trained_field', value)}
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
                21. Mức thu nhập bình quân/tháng tính theo VNĐ của Anh/Chị hiện nay?
              </Text>
              <Radio.Group
                value={getValues('average_income') as unknown as string}
                onChange={(value) => setRadioValue('average_income', value)}
                error={errors?.average_income?.message}
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
                22. Anh/chị tìm được việc làm thông qua những những hình thức nào?
              </Text>
              <Checkbox.Group onChange={(value) => setCheckboxValue('job_search_method', value)}>
                {LIST_OPTION_QUESTION_FORM[6].map((item, index) => (
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
                    value={getValues('job_search_method')?.other_content}
                    onChange={(e) => setOtherContent('job_search_method', e.target.value)}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                23. Mức độ Anh/Chị áp dụng kiến thức đã được đào tạo vào thực tế công việc?
              </Text>
              <Radio.Group
                value={getValues('level_knowledge_acquired') as unknown as string}
                onChange={(value) => setRadioValue('level_knowledge_acquired', value)}
              >
                {LIST_OPTION_QUESTION_FORM[8].map((item) => (
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
                24. Mức độ Anh/Chị áp dụng kỹ năng đã được đào tạo vào thực tế công việc?
              </Text>
              <Radio.Group
                value={getValues('professional_qualification_field') as unknown as string}
                onChange={(value) => setRadioValue('professional_qualification_field', value)}
              >
                {LIST_OPTION_QUESTION_FORM[8].map((item) => (
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
                25. Trong quá trình làm việc, Anh/Chị cần những kỹ năng mềm nào sau đây?
              </Text>
              <Checkbox.Group onChange={(value) => setCheckboxValue('soft_skills_required', value)}>
                {LIST_OPTION_QUESTION_FORM[9].map((item, index) => (
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
                    value={getValues('soft_skills_required')?.other_content}
                    onChange={(e) => setOtherContent('soft_skills_required', e.target.value)}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                26 Sau khi được tuyển dụng, Anh/Chị có phải tham gia khóa học nâng cao nào dưới đây
                để đáp ứng công việc không? <span className="required">*</span>
              </Text>
              <Checkbox.Group
                onChange={(value) => setCheckboxValue('must_attended_courses', value)}
                error={errors?.must_attended_courses?.message}
              >
                {LIST_OPTION_QUESTION_FORM[10].map((item, index) => (
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
                    value={getValues('must_attended_courses')?.other_content}
                    onChange={(e) => setOtherContent('must_attended_courses', e.target.value)}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
            <Card shadow="sm" padding="lg" mb="lg">
              <Text fw={600} size="sm">
                27 Theo Anh/Chị, những giải pháp nào sau đây giúp tăng tỷ lệ có việc làm đúng ngành
                của sinh viên tốt nghiệp từ chương trình đào tạo mà Anh/Chị đã học?
                <span className="required">*</span>
              </Text>
              <Checkbox.Group
                onChange={(value) => setCheckboxValue('solutions_get_job', value)}
                error={errors?.solutions_get_job?.message}
              >
                {LIST_OPTION_QUESTION_FORM[11]?.map((item, index) => (
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
                    value={getValues('solutions_get_job')?.other_content}
                    onChange={(e) => setOtherContent('solutions_get_job', e.target.value)}
                    placeholder="Nhập lựa chọn khác"
                  />
                )}
              </Checkbox.Group>
            </Card>
          </>
        )}
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
