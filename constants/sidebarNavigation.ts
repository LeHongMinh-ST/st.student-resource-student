import { IconBook, IconBookmark, IconBuilding } from '@tabler/icons-react';
import { SidebarNavigationProps } from '@/types';

const sidebarNavigationAdmin: SidebarNavigationProps[] = [
  {
    title: 'Thông tin sinh viên',
    links: [
      { label: 'Bộ môn', icon: IconBuilding, link: '/profile' },
      { label: 'Ngành học', icon: IconBookmark, link: '/majors' },
      { label: 'Lớp học', icon: IconBook, link: '/classes' },
    ],
  },
];

export default sidebarNavigationAdmin;
