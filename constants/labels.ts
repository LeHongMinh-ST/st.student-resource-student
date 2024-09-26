import {
  ClassType,
  FamilyRelationship,
  Gender,
  RoleEnum,
  StatusEnum,
  StatusFileImport,
  StudentRole,
  StudentStatus,
} from '@/enums';
import SocialPolicyObject from '@/enums/socialPolicyObject.enum';
import TrainingType from '@/enums/trainingType.enum';

export const statusLabels: Record<StatusEnum, string> = {
  [StatusEnum.Enable]: 'Hoạt động',
  [StatusEnum.Disable]: 'Ẩn',
  [StatusEnum.Draft]: 'Nháp',
};

export const statusFileImportLabels: Record<StatusFileImport, string> = {
  [StatusFileImport.Completed]: 'Đã xử lý',
  [StatusFileImport.Processing]: 'Đang xử lý',
  [StatusFileImport.Pending]: 'Chờ xử lý',
};

export const roleLabels: Record<RoleEnum, string> = {
  [RoleEnum.Admin]: 'Quản trị viên',
  [RoleEnum.Teacher]: 'Giảng viên',
  [RoleEnum.Office]: 'Cán bộ khoa',
};

export const studentRoleLabels: Record<StudentRole, string> = {
  [StudentRole.President]: 'Lớp trưởng',
  [StudentRole.VicePresident]: 'Lớp phóng',
  [StudentRole.Secretary]: 'Bí thư',
  [StudentRole.ViceSecretary]: 'Phó bí thư',
  [StudentRole.Basic]: 'Sinh viên',
};

export const studentStatusLabels: Record<StudentStatus, string> = {
  [StudentStatus.CurrentlyStudying]: 'Đang học',
  [StudentStatus.Graduated]: 'Đã tốt nghiệp',
  [StudentStatus.TemporarilySuspended]: 'Tạm dừng học',
  [StudentStatus.Expelled]: 'Đã bị đuổi học',
  [StudentStatus.Deferred]: 'Bảo lưu',
  [StudentStatus.TransferStudy]: 'Chuyển nghành học',
};

export const familyRelationshipLabels: Record<FamilyRelationship, string> = {
  [FamilyRelationship.Father]: 'Bố',
  [FamilyRelationship.Mother]: 'Mẹ',
  [FamilyRelationship.Siblings]: 'Anh/Chị/Em',
};

export const genderLabels: Record<Gender, string> = {
  [Gender.Male]: 'Nam',
  [Gender.Female]: 'Nữ',
  [Gender.Unspecified]: 'Khác',
};

export const trainingTypeLabels: Record<TrainingType, string> = {
  [TrainingType.FormalUniversity]: 'Đại học chính quy',
  [TrainingType.College]: 'Cao đẳng',
};

export const socialPolicyObjectLabels: Record<SocialPolicyObject, string> = {
  [SocialPolicyObject.None]: 'Không',
  [SocialPolicyObject.SonOfWounded]: 'Con thương binh liệt sĩ',
  [SocialPolicyObject.EspeciallyDifficult]: 'Đối tượng đặc biệt khó khăn',
  [SocialPolicyObject.EthnicMinorityPeopleInTheHighlands]: 'Dân tộc thiểu số ở vùng cao',
  [SocialPolicyObject.DisabledPerson]: 'Người khuyết tật',
};

export const classTypeLabels: Record<ClassType, string> = {
  [ClassType.Basic]: 'Cơ bản',
  [ClassType.Major]: 'Chuyên ngành',
};
