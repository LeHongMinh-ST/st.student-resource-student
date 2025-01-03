import { BaseParamsList, MetaResponse, SelectList } from '@/types';
import {
  genderLabels,
  roleLabels,
  statusLabels,
  studentInfoUpdateStatusLabels,
  studentStatusLabels,
} from './labels';
import { RoleEnum, StudentStatus } from '@/enums';
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

export const GenderSelectList: SelectList<Gender>[] = [
  { value: Gender.Male, label: genderLabels.male },
  { value: Gender.Female, label: genderLabels.female },
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
