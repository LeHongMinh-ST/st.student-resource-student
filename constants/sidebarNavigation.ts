import { IconBuilding, IconUserCircle, IconSpeakerphone } from '@tabler/icons-react';
import { SidebarNavigationProps } from '@/types';

export const sidebarNavigationStudent: SidebarNavigationProps[] = [
  {
    title: 'Thông tin sinh viên',
    links: [
      { label: 'Thông tin', icon: IconUserCircle, link: '/' },
      { label: 'Lớp học', icon: IconBuilding, link: '/classes' },
    ],
  },
];

export const sidebarNavigationStudentPresident: SidebarNavigationProps[] = [
  ...sidebarNavigationStudent,
  {
    title: 'Yêu cầu chỉnh sửa',
    links: [{ label: 'Danh sách yêu cầu', icon: IconSpeakerphone, link: '/request-update' }],
  },
  {
    title: 'Phản ánh',
    links: [{ label: 'Phản ánh', icon: IconSpeakerphone, link: '/reflect' }],
  },
];
