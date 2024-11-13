import styled from '@emotion/styled';
import { Card, Text, TextInput, Button, Select, Radio, Checkbox } from '@mantine/core';
import { IconSearch, IconCalendar, IconSend, IconTrash } from '@tabler/icons-react';
import { FieldValues, useForm } from 'react-hook-form';
import { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import 'dayjs/locale/vi';
import { GenderSelectList } from '@/constants/commons';
import { ANSWER_EMPLOYMENT_STATUS, LIST_OPTION_QUESTION_FORM } from '@/constants/form';
import { FormJobSurvey, IOptionCheckbox } from '@/types';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

const JobSurveyPage = () => {
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

    console.log(getValues('employment_solutions'));
  };

  const setOtherContent = (fieldName: keyof FormJobSurvey, value: string): void => {
    const valueForm = getValues(fieldName) as IOptionCheckbox;
    setValue(fieldName, { ...valueForm, other_content: value } as IOptionCheckbox);
    trigger(fieldName);
  };

  const setRadioValue = (fieldName: keyof FormJobSurvey, value: string | number): void => {
    setValue(fieldName, value);
    trigger(fieldName);
  };

  const onSubmitForm = (data: FieldValues) => {
    if (!isSubmitting) {
      console.log('Submit form');
      console.log(data);
    }
  };

  return (
    <JobSurveyPageStyled>
      <div className="form-wrap">
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="xl" ta="center">
            Khảo sát việc làm
          </Text>

          <Text mt="xs" c="dimmed" size="sm">
            Thời gian khảo sát từ ngày <b>20/11/2024</b> đến ngày <b>21/11/2024</b>
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
            placeholder="Chọn giới tính"
            data={GenderSelectList}
            value={getValues('gender') ?? ''}
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
            5. Số chứng minh thư/Căn cước công dân <span className="required text-red">*</span>
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
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            6. Ngày cấp <span className="required text-red">*</span>
          </Text>
          <DatePickerInput
            rightSection={<IconCalendar style={{ width: '18px', height: '18px' }} stroke={1.5} />}
            placeholder="DD/MM/YYYY"
            locale="vi"
            valueFormat="DD/MM/YYYY"
            value={getValues('doi_card') ? new Date(getValues('doi_card') ?? '') : null}
            onChange={(value) => {
              if (value) {
                const formattedValue = value.toLocaleDateString('vi-VN');
                setValue('doi_card', formattedValue);
              } else {
                setValue('doi_card', '');
              }
              trigger('doi_card');
            }}
            error={errors?.doi_card?.message}
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            7. Nơi cấp CMT/CCCD <span className="required text-red">*</span>
          </Text>
          <TextInput
            variant="unstyled"
            placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ"
            {...register('place_issue', {
              required: ERROR_MESSAGES.form_job.place_issue.required,
            })}
            error={errors?.place_issue?.message}
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
            placeholder="Chọn ngành đào tạo"
            value={(getValues('training_industry_id') as string) ?? ''}
            onChange={(value) => {
              if (value) {
                // @ts-ignore
                setValue('training_industry_id', value);
                trigger('training_industry_id');
              }
            }}
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
            value={getValues('employment_status') as string}
            onChange={(value) => setRadioValue('employment_status', value)}
          >
            {LIST_OPTION_QUESTION_FORM[1].map((item) => (
              <Radio mt="lg" value={String(item.value)} label={item.label}></Radio>
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
                value={getValues('work_area') as string} // Make sure to add this key in your form state
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
                value={getValues('employed_since') as string}
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
                value={getValues('trained_field') as string}
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
                value={getValues('required_knowledge') as string}
                onChange={(value) => setRadioValue('required_knowledge', value)}
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
                value={getValues('current_income') as string}
                onChange={(value) => setRadioValue('current_income', value)}
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
              <Checkbox.Group onChange={(value) => setCheckboxValue('find_job', value)}>
                {LIST_OPTION_QUESTION_FORM[6].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    checked={checkValueInArrayCheckbox('find_job', item.value)}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {watch('find_job')?.value?.includes('0') && (
                  <TextInput
                    mt="sm"
                    variant="unstyled"
                    value={getValues('find_job')?.other_content}
                    onChange={(e) => setOtherContent('find_job', e.target.value)}
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
                value={getValues('degree_knowledge_used') as string}
                onChange={(value) => setRadioValue('degree_knowledge_used', value)}
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
                value={getValues('degree_skill_used') as string}
                onChange={(value) => setRadioValue('degree_skill_used', value)}
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
                onChange={(value) => setCheckboxValue('training_course_required', value)}
              >
                {LIST_OPTION_QUESTION_FORM[10].map((item, index) => (
                  <Checkbox
                    mt="lg"
                    key={index}
                    checked={checkValueInArrayCheckbox('training_course_required', item.value)}
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {watch('training_course_required')?.value?.includes('0') && (
                  <TextInput
                    mt="sm"
                    variant="unstyled"
                    value={getValues('training_course_required')?.other_content}
                    onChange={(e) => setOtherContent('training_course_required', e.target.value)}
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
              <Checkbox.Group onChange={(value) => setCheckboxValue('employment_solutions', value)}>
                {LIST_OPTION_QUESTION_FORM[11]?.map((item, index) => (
                  <Checkbox
                    key={index}
                    checked={checkValueInArrayCheckbox('employment_solutions', item.value)}
                    mt="lg"
                    value={String(item.value)}
                    label={item.label}
                  ></Checkbox>
                ))}
                <Checkbox mt="lg" value="0" label="Khác"></Checkbox>
                {watch('employment_solutions')?.value?.includes('0') && (
                  <TextInput
                    mt="sm"
                    variant="unstyled"
                    value={getValues('employment_solutions')?.other_content}
                    onChange={(e) => setOtherContent('employment_solutions', e.target.value)}
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
          <Button leftSection={<IconTrash size={14} />} variant="default">
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
