import { SelectList } from '@/types';
import Gender from '../enums/gender.enum';
import { genderLabels } from '@/constants/labels';

export const ANSWER_EMPLOYMENT_STATUS = {
  employed: 1,
  advancedLearning: 2,
  unemployed: 3,
};
export const ANSWER_TRAINED_FIELD = {
  rightMajor: 1,
  relatedMajor: 2,
  notRelatedMajor: 3,
};

export const ANSWER_WORK_AREA = {
  governmentArea: 1, //Nhà nước
  privateArea: 2, //Tư nhân
  areaForeignElements: 3, //Khu vực yếu tố nước ngoài
  generateEmployment: 4, //Tự tạo việc làm
};

export const LIST_OPTION_QUESTION_FORM: SelectList<number | string | Gender>[][] = [
  [
    {
      label: genderLabels.male,
      value: Gender.Male,
    },
    {
      label: genderLabels.female,
      value: Gender.Female,
    },
  ],
  [
    { label: 'Đã có việc làm', value: ANSWER_EMPLOYMENT_STATUS.employed },
    { label: 'Đang học nâng cao', value: ANSWER_EMPLOYMENT_STATUS.advancedLearning },
    { label: 'Chưa có việc làm', value: ANSWER_EMPLOYMENT_STATUS.unemployed },
  ],
  [
    { label: 'Khu vực nhà nước', value: ANSWER_WORK_AREA.governmentArea },
    { label: 'Khu vực tư nhân', value: ANSWER_WORK_AREA.privateArea },
    { label: 'Có yếu tố nước ngoài', value: ANSWER_WORK_AREA.areaForeignElements },
    { label: 'Tự tạo việc làm', value: ANSWER_WORK_AREA.generateEmployment },
  ],
  [
    { label: 'Trong vòng 3 tháng', value: 1 },
    { label: 'Trong vòng 6 tháng', value: 2 },
    { label: 'Từ 6 tháng đến 12 tháng', value: 3 },
    { label: 'Trên 1 năm', value: 4 },
  ],
  [
    { label: 'Đúng ngành đào tạo', value: ANSWER_TRAINED_FIELD.rightMajor },
    { label: 'Liên quan đến ngành đào tạo', value: ANSWER_TRAINED_FIELD.relatedMajor },
    { label: 'Không liên quan đến ngành đào tạo', value: ANSWER_TRAINED_FIELD.notRelatedMajor },
  ],
  [
    { label: 'Đã học được', value: 1 },
    { label: 'Chỉ học được một phần', value: 2 },
    { label: 'Không học được', value: 3 },
  ],
  [
    { label: 'Do Học viện/Khoa giới thiệu', value: 1 },
    { label: 'Bạn bè, người quen giới thiệu', value: 2 },
    { label: 'Tự tìm việc làm', value: 3 },
    { label: 'Tự tạo việc làm', value: 4 },
  ],
  [
    { label: 'Dưới 5 triệu', value: 1 },
    { label: 'Từ 5 triệu - 10 triệu', value: 2 },
    { label: 'Từ 10 triệu - 15 triệu', value: 3 },
    { label: 'Trên 15 triệu', value: 4 },
  ],
  [
    { label: 'Áp dụng rất nhiều', value: 1 },
    { label: 'Áp dụng tương đối nhiều', value: 2 },
    { label: 'Áp dụng ít', value: 3 },
    { label: 'Áp dụng rất ít', value: 4 },
    { label: 'Không áp dụng', value: 5 },
  ],
  [
    { label: 'Kỹ năng giao tiếp', value: 1 },
    { label: 'Kỹ năng thuyết trình', value: 2 },
    { label: 'Kỹ năng làm việc nhóm', value: 3 },
    { label: 'Kỹ năng viết báo cáo tài liệu', value: 4 },
    { label: 'Kỹ năng lãnh đạo', value: 5 },
    { label: 'Kỹ năng tiếng Anh', value: 6 },
    { label: 'Kỹ năng tin học', value: 7 },
  ],
  [
    { label: 'Nâng cao kiến thức chuyên môn', value: 1 },
    { label: 'Nâng cao kỹ năng chuyên môn nghiệp vụ', value: 2 },
    { label: 'Nâng cao kỹ năng về công nghệ thông tin', value: 3 },
    { label: 'Nâng cao kỹ năng ngoại ngữ', value: 4 },
    { label: 'Nâng cao kỹ năng mềm', value: 5 },
    { label: 'Phát triển kỹ năng quản lý', value: 6 },
    { label: 'Tiếp tục học lên cao', value: 7 },
  ],
  [
    {
      label:
        'Học viện tổ chức các buổi trao đổi chia sẻ kinh nghiệm tìm việc làm giữa cựu sinh viên với các sinh viên đang học',
      value: 1,
    },
    {
      label: 'Học viện tổ chức các buổi trao đổi giữa sinh viên với các nhà sử dụng lao động',
      value: 2,
    },
    { label: 'Nhà sử dụng lao động tham gia vào quá trình đào tạo', value: 3 },
    {
      label:
        'Chương trình đào tạo được điều chỉnh và cập nhật theo nhu cầu của thị trường lao động',
      value: 4,
    },
    { label: 'Tăng cường các hoạt động thực hành và chuyên môn tại cơ sở', value: 5 },
  ],
];
