import { FC } from 'react';
import useSWR from 'swr';
import { useStudentService } from '@/services/studentService';
import { GeneralClass, ResultResponse } from '@/types';

type ClassStudentProps = {
  studentId?: number;
};
const ClassStudent: FC<ClassStudentProps> = ({ studentId }) => {
  const { getStudentClassesById } = useStudentService();
  const handleGetClassesByStudentId = () =>
    getStudentClassesById(studentId).then((res) => res.data);

  const { data, isLoading } = useSWR<ResultResponse<GeneralClass[]>>(
    [studentId],
    handleGetClassesByStudentId
  );
  console.log(data, isLoading, studentId);

  return <>Đang cập nhật...</>;
};

export default ClassStudent;
