import { BaseParamsList, MetaResponse, SelectList } from '@/types';
import {
  familyRelationshipLabels,
  genderLabels,
  roleLabels,
  statusLabels,
  studentInfoUpdateStatusLabels,
  studentStatusLabels,
  trainingTypeLabels,
} from './labels';
import {
  FamilyRelationship,
  RoleEnum,
  SocialPolicyObject,
  StudentStatus,
  TrainingType,
} from '@/enums';
import Role from '@/enums/role.enum';
import Gender from '../enums/gender.enum';
import Status from '@/enums/status.enum';
import StudentInfoUpdateStatus from '@/enums/studentInfoUpdateStatus.enum';

export const defaultPage: MetaResponse = {
  current_page: 1,
  total: 0,
  per_page: 10,
  last_page: 1,
};

export const defaultPramsList: BaseParamsList = {
  limit: 10,
  page: 1,
};
export const StudentInfoUpdateStatusList: SelectList<StudentInfoUpdateStatus>[] = [
  { value: StudentInfoUpdateStatus.Pending, label: studentInfoUpdateStatusLabels.pending },
  {
    value: StudentInfoUpdateStatus.ClassOfficerApproved,
    label: studentInfoUpdateStatusLabels.class_officer_approved,
  },
  {
    value: StudentInfoUpdateStatus.TeacherApproved,
    label: studentInfoUpdateStatusLabels.teacher_approved,
  },
  {
    value: StudentInfoUpdateStatus.OfficerApproved,
    label: studentInfoUpdateStatusLabels.officer_approved,
  },
  { value: StudentInfoUpdateStatus.Rejected, label: studentInfoUpdateStatusLabels.rejected },
];
export const StatusList: SelectList<Status>[] = [
  { value: Status.Enable, label: statusLabels.enable },
  { value: Status.Disable, label: statusLabels.disable },
];
export const RoleSelectList: SelectList<Role>[] = [
  { value: RoleEnum.Admin, label: roleLabels.admin },
  { value: RoleEnum.Office, label: roleLabels.office },
  { value: RoleEnum.Teacher, label: roleLabels.teacher },
];

export const GenderList: SelectList<Gender>[] = [
  { value: Gender.Male, label: 'Nam' },
  { value: Gender.Female, label: 'Nữ' },
  { value: Gender.Unspecified, label: 'Khác' },
];

export const TrainingTypeList: SelectList<TrainingType>[] = [
  { value: TrainingType.FormalUniversity, label: trainingTypeLabels.formal_university },
  { value: TrainingType.College, label: trainingTypeLabels.college },

  { value: TrainingType.StudyAndWork, label: trainingTypeLabels.study_and_work },
];

export const SocialPolicyObjectList: SelectList<SocialPolicyObject>[] = [
  { value: SocialPolicyObject.None, label: 'Không' },
  { value: SocialPolicyObject.SonOfWounded, label: 'Con thương binh liệt sĩ' },
  { value: SocialPolicyObject.DisabledPerson, label: 'Người khuyết tật' },
  { value: SocialPolicyObject.EspeciallyDifficult, label: 'Đối tượng đặc biệt khó khăn' },
  {
    value: SocialPolicyObject.EthnicMinorityPeopleInTheHighlands,
    label: 'Dân tộc thiểu số ở vùng cao',
  },
];

export const GenderSelectList: SelectList<Gender>[] = [
  { value: Gender.Male, label: genderLabels.male },
  { value: Gender.Female, label: genderLabels.female },
];
export const FamilyRelationshipList: SelectList<FamilyRelationship>[] = [
  { value: FamilyRelationship.Father, label: familyRelationshipLabels.father },
  { value: FamilyRelationship.Mother, label: familyRelationshipLabels.mother },
  { value: FamilyRelationship.Siblings, label: familyRelationshipLabels.siblings },
  { value: FamilyRelationship.Grandparent, label: familyRelationshipLabels.grandparent },
  { value: FamilyRelationship.Other, label: familyRelationshipLabels.other },
];

export const GenderSelectListFormSurvey: SelectList<string>[] = [
  { value: '1', label: genderLabels.male },
  { value: '0', label: genderLabels.female },
];

export const StudentStatusSelectList: SelectList<StudentStatus>[] = [
  { value: StudentStatus.CurrentlyStudying, label: studentStatusLabels.currently_studying },
  { value: StudentStatus.Graduated, label: studentStatusLabels.graduated },
  { value: StudentStatus.TemporarilySuspended, label: studentStatusLabels.temporarily_suspended },
  { value: StudentStatus.Expelled, label: studentStatusLabels.expelled },
  { value: StudentStatus.Deferred, label: studentStatusLabels.deferred },
  { value: StudentStatus.TransferStudy, label: studentStatusLabels.transfer_study },
];
