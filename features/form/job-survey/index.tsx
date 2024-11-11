import styled from '@emotion/styled';
import { Card, Text, TextInput, Button, Select, Radio, Checkbox } from '@mantine/core';
import { IconSearch, IconCalendar, IconSend, IconTrash } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import 'dayjs/locale/vi';
import { GenderSelectList } from '@/constants/commons';
import { LIST_OPTION_QUESTION_FORM } from '@/constants/form';

const JobSurveyPage = () => {
  const className = 'page-job-survey';

  return (
    <JobSurveyPageStyled>
      <div className={`form-wrap ${className}`}>
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
          <TextInput variant="unstyled" placeholder="vd: 637711" />
        </Card>

        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            2. Họ và tên <span className="required text-red">*</span>
          </Text>
          <TextInput variant="unstyled" placeholder="vd: Đào Đức Anh" />
        </Card>

        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            3. Giới tính <span className="required text-red">*</span>
          </Text>
          <Select placeholder="Chọn giới tính" data={GenderSelectList} />
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
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            5. Số chứng minh thư/Căn cước công dân <span className="required text-red">*</span>
          </Text>
          <TextInput variant="unstyled" placeholder="vd: 0334********" />
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
          />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            7. Nơi cấp CMT/CCCD <span className="required text-red">*</span>
          </Text>
          <TextInput variant="unstyled" placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ" />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            8. Khoá học <span className="required text-red">*</span>
          </Text>
          <TextInput variant="unstyled" placeholder="vd: K63" />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            9. Tên ngành đào tạo <span className="required text-red">*</span>
          </Text>
          <Select placeholder="Chọn ngành đào tạo" />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            10. Điện thoại <span className="required text-red">*</span>
          </Text>
          <TextInput variant="unstyled" placeholder="vd: 0333555****" />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            11. Email <span className="required text-red">*</span>
          </Text>
          <TextInput variant="unstyled" placeholder="vd: abc@gmail.com" />
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            12. Anh/Chị vui lòng cho biết tình trạng việc làm hiện tại của Anh/Chị
          </Text>
          <Radio.Group>
            {LIST_OPTION_QUESTION_FORM[1].map((item) => (
              <Radio mt="lg" value={item.value} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
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
          <TextInput variant="unstyled" placeholder="vd: Khu 2 Hoàng Khương, Thanh Ba, Phú Thọ" />
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
          <Radio.Group>
            {LIST_OPTION_QUESTION_FORM[2].map((item) => (
              <Radio mt="lg" value={item.value} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            18. Sau khi tốt nghiệp, Anh/Chị có việc làm khi nào ?
          </Text>
          <Radio.Group>
            {LIST_OPTION_QUESTION_FORM[3].map((item) => (
              <Radio mt="lg" value={item.value} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            19. Công việc Anh/Chị đang đảm nhận có phù hợp với ngành được đào tạo không?
          </Text>
          <Radio.Group>
            {LIST_OPTION_QUESTION_FORM[4].map((item) => (
              <Radio mt="lg" value={item.value} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            20. Anh/chị có học được các kiến thức và kỹ năng cần thiết từ nhà trường cho công việc
            theo ngành tốt nghiệp không?
          </Text>
          <Radio.Group>
            {LIST_OPTION_QUESTION_FORM[5].map((item) => (
              <Radio mt="lg" value={item.value} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            21. Mức thu nhập bình quân/tháng tính theo VNĐ của Anh/Chị hiện nay?
          </Text>
          <Radio.Group>
            {LIST_OPTION_QUESTION_FORM[7].map((item) => (
              <Radio mt="lg" value={item.value} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            22. Anh/chị tìm được việc làm thông qua những những hình thức nào?
          </Text>
          <Checkbox.Group>
            {LIST_OPTION_QUESTION_FORM[6].map((item) => (
              <Checkbox mt="lg" value={item.value} label={item.label}></Checkbox>
            ))}
            <Checkbox mt="lg" value={0} label="Khác"></Checkbox>
            <TextInput mt="sm" variant="unstyled" placeholder="Nhập lựa chọn khác" />
          </Checkbox.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            23. Mức độ Anh/Chị áp dụng kiến thức đã được đào tạo vào thực tế công việc?
          </Text>
          <Radio.Group>
            {LIST_OPTION_QUESTION_FORM[8].map((item) => (
              <Radio mt="lg" value={item.value} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            24. Mức độ Anh/Chị áp dụng kỹ năng đã được đào tạo vào thực tế công việc?
          </Text>
          <Radio.Group>
            {LIST_OPTION_QUESTION_FORM[8].map((item) => (
              <Radio mt="lg" value={item.value} label={item.label}></Radio>
            ))}
          </Radio.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            25. Trong quá trình làm việc, Anh/Chị cần những kỹ năng mềm nào sau đây?
          </Text>
          <Checkbox.Group>
            {LIST_OPTION_QUESTION_FORM[9].map((item) => (
              <Checkbox mt="lg" value={item.value} label={item.label}></Checkbox>
            ))}
            <Checkbox mt="lg" value={0} label="Khác"></Checkbox>
            <TextInput mt="sm" variant="unstyled" placeholder="Nhập lựa chọn khác" />
          </Checkbox.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            26 Sau khi được tuyển dụng, Anh/Chị có phải tham gia khóa học nâng cao nào dưới đây để
            đáp ứng công việc không? <span className="required">*</span>
          </Text>
          <Checkbox.Group>
            {LIST_OPTION_QUESTION_FORM[10].map((item) => (
              <Checkbox mt="lg" value={item.value} label={item.label}></Checkbox>
            ))}
            <Checkbox mt="lg" value={0} label="Khác"></Checkbox>
            <TextInput mt="sm" variant="unstyled" placeholder="Nhập lựa chọn khác" />
          </Checkbox.Group>
        </Card>
        <Card shadow="sm" padding="lg" mb="lg">
          <Text fw={600} size="sm">
            27 Theo Anh/Chị, những giải pháp nào sau đây giúp tăng tỷ lệ có việc làm đúng ngành của
            sinh viên tốt nghiệp từ chương trình đào tạo mà Anh/Chị đã học?
            <span className="required">*</span>
          </Text>
          <Checkbox.Group>
            {LIST_OPTION_QUESTION_FORM[11].map((item) => (
              <Checkbox mt="lg" value={item.value} label={item.label}></Checkbox>
            ))}
            <Checkbox mt="lg" value={0} label="Khác"></Checkbox>
            <TextInput mt="sm" variant="unstyled" placeholder="Nhập lựa chọn khác" />
          </Checkbox.Group>
        </Card>
        <div className="form-button">
          <Button leftSection={<IconSend size={14} />}>Gửi</Button>
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
