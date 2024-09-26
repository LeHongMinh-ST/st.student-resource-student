import { FC, useState, useCallback } from 'react';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { AdmissionYear } from '@/types';
import ListExcelFileImport from './StudentImportTabComponent/ListExcelFileImport';
import StudentDropzoneImport from './StudentImportTabComponent/StudentDropzoneImport';
import { useStudentService } from '@/services/studentService';

type StudentImportTabContentProps = {
  admissionYear: AdmissionYear;
};

const StudentImportTabContent: FC<StudentImportTabContentProps> = ({ admissionYear }) => {
  const [fileValue, setFileValue] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isReloadList, setIsReloadList] = useState<boolean>(false);
  const studentService = useStudentService();

  const clearFileValue = useCallback(() => {
    setFileValue(null);
  }, []);

  const handleUploadFile = useCallback(async () => {
    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', fileValue!);
      formData.append('admission_year_id', (admissionYear?.id ?? '').toString());

      await studentService.importStudent(formData);

      notifications.show({
        title: 'Thành công!',
        message: 'Tải tệp thành công! Tệp của bạn đang được xử lý',
        icon: <IconCheck />,
        color: 'green.8',
        autoClose: 5000,
      });
      setIsReloadList((prev) => !prev);
      clearFileValue();
    } catch (e) {
      notifications.show({
        title: 'Thất bại!',
        message: 'Có lỗi xảy ra! Vui lòng thử lại sau',
        icon: <IconAlertTriangle />,
        color: 'red',
        autoClose: 5000,
      });
    }
    setIsImporting(false);
  }, [fileValue, admissionYear, studentService, clearFileValue]);

  return (
    <div>
      <StudentDropzoneImport
        fileValue={fileValue}
        isImporting={isImporting}
        onFileUpload={setFileValue}
        onUpload={handleUploadFile}
      />
      <div className="list-import">
        <ListExcelFileImport admissionYear={admissionYear} isReloadList={isReloadList} />
      </div>
    </div>
  );
};

export default StudentImportTabContent;
