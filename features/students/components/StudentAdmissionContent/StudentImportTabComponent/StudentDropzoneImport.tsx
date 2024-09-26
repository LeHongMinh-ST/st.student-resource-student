import { Button, Text } from '@mantine/core';
import { Dropzone, MS_EXCEL_MIME_TYPE } from '@mantine/dropzone';
import { FC, useRef, useCallback } from 'react';
import { modals } from '@mantine/modals';
import { IconCloudUpload, IconFileSpreadsheet, IconUpload, IconX } from '@tabler/icons-react';
import styled from '@emotion/styled';

type StudentDropzoneImportProps = {
  onFileUpload: (file: File | null) => void;
  onUpload: () => void;
  isImporting: boolean;
  fileValue: File | null;
};

const StudentDropzoneImport: FC<StudentDropzoneImportProps> = ({
  onFileUpload,
  onUpload,
  isImporting,
  fileValue,
}) => {
  const openRef = useRef<() => void>(() => {});

  const openModalConfirmImport = useCallback(() => {
    modals.openConfirmModal({
      title: <Text size="lg">Nhập dữ liệu sinh viên ?</Text>,
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn nhập dữ liệu sinh viên từ tệp
          <span className="file-name">{fileValue?.name}</span>?{' '}
        </Text>
      ),
      labels: { confirm: 'Tải lên', cancel: 'Đóng' },
      onConfirm: () => onUpload(),
    });
  }, [fileValue, onUpload]);

  return (
    <StudentDropzoneImportStyled>
      <div className="header-import">
        <Dropzone
          openRef={openRef}
          multiple={false}
          onDrop={(files) => onFileUpload(files[0])}
          className="drop-zone"
          activateOnClick={false}
          h={200}
          bg="#F7F8F9"
          radius={8}
          styles={{ inner: { pointerEvents: 'all' } }}
          accept={MS_EXCEL_MIME_TYPE}
          loading={isImporting}
        >
          <div className="drop-zone-inner">
            <div className="drop-zone-title">
              <IconFileSpreadsheet size={46} />
              <div className="drop-zone-text">
                <div className="drop-zone-text-main">Kéo tệp vào đây hoặc nhấp để chọn tệp</div>
              </div>
            </div>
            <Button
              mih={32}
              h={32}
              variant="outline"
              onClick={() => openRef.current()}
              className="upload-file-button"
              leftSection={<IconCloudUpload size={18} />}
            >
              <Text truncate="end">Chọn tập tin</Text>
            </Button>
            {fileValue && (
              <div className="drop-zone-file">
                <Text>{fileValue.name}</Text>
                <IconX style={{ cursor: 'pointer' }} onClick={() => onFileUpload(null)} />
              </div>
            )}
          </div>
        </Dropzone>
        {fileValue && (
          <Button
            onClick={openModalConfirmImport}
            leftSection={<IconUpload />}
            className="import-button"
          >
            Tải lên
          </Button>
        )}
      </div>
    </StudentDropzoneImportStyled>
  );
};

const StudentDropzoneImportStyled = styled.div`
  .header-import {
    margin-top: 20px;
    text-align: center;

    .drop-zone {
      display: flex;
      height: 200px;
      border-radius: 8px;
      border: 0.12px dashed #e8eaed;
      background-color: #f7f8f9;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 16px 8px;
      &-file {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      &-title {
        font-size: 18px;
        font-weight: 500;
        color: #666666;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      &-inner {
        display: flex;
        justify-content: center;
        gap: 16px;
        align-items: center;
        flex-direction: column;
      }
    }
  }
`;

export default StudentDropzoneImport;
