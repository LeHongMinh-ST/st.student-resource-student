import { SelectList } from '@/types';
import Gender from '../enums/gender.enum';
import { genderLabels } from '@/constants/labels';

export const ANSWER_EMPLOYMENT_STATUS = {
  employed: 1,
  advancedLearning: 2,
  unemployed: 3,
  notLookingForJob: 4,
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
      value: 1,
    },
    {
      label: genderLabels.female,
      value: 0,
    },
  ],
  [
    { label: 'Đã có việc làm', value: ANSWER_EMPLOYMENT_STATUS.employed },
    { label: 'Đang tiếp tục học', value: ANSWER_EMPLOYMENT_STATUS.advancedLearning },
    { label: 'Chưa có việc làm', value: ANSWER_EMPLOYMENT_STATUS.unemployed },
    { label: 'Chưa đi tìm việc', value: ANSWER_EMPLOYMENT_STATUS.notLookingForJob },
  ],
  [
    { label: 'Khu vực nhà nước', value: ANSWER_WORK_AREA.governmentArea },
    { label: 'Khu vực tư nhân', value: ANSWER_WORK_AREA.privateArea },
    { label: 'Có yếu tố nước ngoài', value: ANSWER_WORK_AREA.areaForeignElements },
    { label: 'Tự tạo việc làm', value: ANSWER_WORK_AREA.generateEmployment },
  ],
  [
    { label: 'Dưới 3 tháng', value: 1 },
    { label: 'Từ 3 tháng đến 6 tháng', value: 2 },
    { label: 'Từ 6 tháng đến 12 tháng', value: 3 },
    { label: 'Trên 12 tháng', value: 4 },
  ],
  [
    { label: 'Đúng ngành đào tạo', value: ANSWER_TRAINED_FIELD.rightMajor },
    { label: 'Liên quan đến ngành đào tạo', value: ANSWER_TRAINED_FIELD.relatedMajor },
    { label: 'Không liên quan đến ngành đào tạo', value: ANSWER_TRAINED_FIELD.notRelatedMajor },
  ],
  [
    { label: 'Chưa phù hợp với trình độ chuyên môn', value: 1 },
    { label: 'Phù hợp với trình độ chuyên môn', value: 2 },
  ],
  [
    { label: 'Đã học được', value: 1 },
    { label: 'Không học được', value: 2 },
    { label: 'Chỉ học được một phần', value: 3 },
  ],
  [
    { label: 'Dưới 5 triệu', value: 1 },
    { label: 'Từ 5 triệu - 10 triệu', value: 2 },
    { label: 'Từ 10 triệu - 15 triệu', value: 3 },
    { label: 'Trên 15 triệu', value: 4 },
  ],
  [
    { label: 'Do Học viện/Khoa giới thiệu', value: 1 },
    { label: 'Bạn bè, người quen giới thiệu', value: 3 },
    { label: 'Tự tìm việc làm', value: 2 },
    { label: 'Tự tạo việc làm', value: 4 },
  ],
  [
    { label: 'Thi tuyển', value: 1 },
    { label: 'Xét tuyển', value: 2 },
    { label: 'Hợp đồng', value: 3 },
    { label: 'Biệt phái', value: 4 },
    { label: 'Điều động', value: 5 },
  ],
  [
    { label: 'Kỹ năng giao tiếp', value: 1 },
    { label: 'Kỹ năng lãnh đạo', value: 2 },
    { label: 'Kỹ năng thuyết trình', value: 3 },
    { label: 'Kỹ năng tiếng Anh', value: 4 },
    { label: 'Kỹ năng làm việc nhóm', value: 5 },
    { label: 'Kỹ năng tin học', value: 6 },
    { label: 'Kỹ năng viết báo cáo tài liệu', value: 7 },
    { label: 'Kỹ năng hội nhập quốc tế', value: 8 },
  ],
  [
    { label: 'Nâng cao kiến thức chuyên môn', value: 1 },
    { label: 'Nâng cao kỹ năng chuyên môn nghiệp vụ', value: 2 },
    { label: 'Nâng cao kỹ năng về công nghệ thông tin', value: 3 },
    { label: 'Nâng cao kỹ năng ngoại ngữ', value: 4 },
    { label: 'Phát triển kỹ năng quản lý', value: 5 },
    { label: 'Tiếp tục học lên cao', value: 6 },
  ],
  [
    {
      label:
        'Học viện tổ chức các buổi trao đổi, chia sẻ kinh nghiệm tìm kiếm việc làm giữa cựu sinh viên với sinh viên',
      value: 1,
    },
    {
      label: 'Học viện tổ chức các buổi trao đổi giữa đơn vị sử dụng lao động với sinh viên',
      value: 2,
    },
    { label: 'Đơn vị sử dụng lao động tham gia vào quá trình đào tạo ', value: 3 },
    {
      label:
        'Chương trình đào tạo được điều chỉnh và cập nhật theo nhu cầu của thị trường lao động',
      value: 4,
    },
    { label: 'Tăng cường các hoạt động thực hành và chuyên môn tại cơ sở', value: 5 },
  ],
];
