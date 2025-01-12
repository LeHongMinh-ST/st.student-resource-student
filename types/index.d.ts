import { StudentStatus } from '@/enums';
import Role from '@/enums/role.enum';
import StudentInfoUpdateStatus from '@/enums/studentInfoUpdateStatus.enum';

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

type MetaResponse = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type ResultResponse<T> = {
  data: T;
  meta?: MetaResponse;
};

type BaseParamsList = {
  limit?: number;
  page?: number;
  q?: string;
  order?: 'asc' | 'desc';
  orderBy?: string;
};

type SelectList<T> = {
  value: T;
  label: string;
};

type SidebarNavigationProps = {
  title: string;
  links: SidebarNavigationLinkProp[];
};

type SidebarNavigationLinkProp = {
  label: string;
  icon: ReactuuNode;
  link: string;
};

type AdmissionYear = {
  id?: number;
  admission_year: string;
  school_year: string;
  student_count: number | string;
  created_at?: string;
  updated_at?: string;
};

type ExcelFileImport = {
  id?: number;
  name: string;
  type: ExcelFileImportType;
  total_record: number;
  process_record: number;
  file_errors_count: number;
  status: StatusFileImport;
  user?: User;
  created_at?: string;
  updated_at?: string;
};

type User = {
  id?: number;
  user_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  email?: string;
  email_verified_at?: string | null;
  code?: string | null;
  thumbnail?: string;
  department_id?: number | null;
  role: Role;
  status?: Status;
  created_at?: string;
  updated_at?: string;
};

type Faculty = {
  id?: number;
  name: string;
  code: string;
};

type GeneralClass = {
  id?: number;
  name: string;
  code: string;
  faculty?: Faculty;
  teacher?: User;
  type: string;
  status: Status;
  created_at?: string;
  updated_at?: string;
};

type StudentGraduation = {
  id?: number;
  student_id: number;
  graduation_id: number;
  gpa: number;
  rank: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

type Student = {
  id?: number;
  last_name: string;
  first_name: string;
  full_name?: string;
  email: string;
  code: string;
  admission_year?: AdmissionYear;
  graduate?: StudentGraduation;
  faculty?: Faculty;
  role: StudentRole;
  status: StudentStatus;
  info: StudentInfo;
  family: Family[];
  currentClass: GeneralClass;
  training_industry_id?: number;
  school_year: string;
  created_at?: string;
  updated_at?: string;
  families?: Family[];
  has_request_update: boolean;
};

type StudentVerify = {
  code: string;
  email?: string;
  phone_number?: string;
  dob?: string;
  identification_card_number?: string;
  training_industry_id?: string;
};

type Family = {
  relationship: FamilyRelationship;
  full_name: string;
  job: string;
  phone: string;
};

type StudentInfo = {
  note: string;
  person_email: string;
  gender: Gender;
  permanent_residence: string;
  dob: string;
  pob: string;
  countryside: string;
  address: string;
  training_type: TrainingType;
  phone: string;
  nationality: string;
  citizen_identification: string;
  ethnic: string;
  religion: string;
  thumbnail: string;
  social_policy_object: SocialPolicyObject;
};

export type FormJobSurvey = {
  id?: number;
  survey_period_id: number;
  student_id?: number;
  email?: string;
  full_name: string;
  dob?: string;
  gender?: number;
  code_student: string;
  identification_card_number?: string;
  identification_card_number_update?: string;
  identification_issuance_place?: string;
  identification_issuance_date?: string;
  training_industry_id?: string;
  course?: string;
  phone_number?: string;
  employment_status: string;

  // optional
  recruit_partner_name?: string;
  recruit_partner_address?: string;
  recruit_partner_date?: string;
  recruit_partner_position?: string;
  work_area?: number | string;
  city_work_id?: number | string;
  employed_since?: number | string;
  trained_field?: number | string;
  professional_qualification_field?: number | string;
  level_knowledge_acquired?: number | string;
  starting_salary?: string;
  average_income?: number | string;
  job_search_method?: IOptionCheckbox;
  recruitment_type?: IOptionCheckbox;
  soft_skills_required?: IOptionCheckbox;
  must_attended_courses?: IOptionCheckbox;
  solutions_get_job: IOptionCheckbox;
};

export type IOptionCheckbox = {
  value: string[];
  content_other?: string;
};

type SurveyPeriod = {
  id?: number;
  title: string;
  description: string;
  status: StatusEnum;
  year: string;
  start_date?: string;
  end_date?: string;
  faculty_id?: number;
  created_at?: string;
  updated_at?: string;
};

type TrainingIndustry = {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
};

type City = {
  id?: number;
  name: string;
  priority: number;
};

type UpdateRequest = {
  id?: number;
  note?: string;
  person_email: string;
  gender: Gender;
  permanent_residence: string;
  dob: string;
  pob: string;
  countryside: string;
  address: string;
  training_type: TrainingType;
  phone: string;
  nationality: string;
  citizen_identification: string;
  ethnic: string;
  religion: string;
  thumbnail: string;
  social_policy_object: SocialPolicyObject;
  families?: Family[];
  student_id: number;
  student: Student;
  status: StudentInfoUpdateStatus;
  created_at?: string;
  updated_at?: string;
};
