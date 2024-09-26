import { Box, Collapse, Group, Text, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import { Icon, IconChevronRight } from '@tabler/icons-react';
import router from 'next/router';
import { useMatchPath } from '@/hooks';
import classes from '@/components/Navigation/Links/links-group.module.scss';

type LinksGroupProps = {
  icon: Icon;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: {
    label: string;
    link: string;
  }[];
  closeSidebar: () => void;
};

const LinksGroup: React.FC<LinksGroupProps> = ({
  icon: IconNode,
  label,
  initiallyOpened,
  links,
  link,
}) => {
  const [isOpen, onOpen] = useState(initiallyOpened || false);
  const matchPath = useMatchPath(link);

  const items = links?.map((item) => (
    <Text
      component={Link}
      href={item.link}
      className={classes.link}
      key={item.label}
      data-active={matchPath || undefined}
    >
      {item.label}
    </Text>
  ));
  return (
    <>
      <UnstyledButton
        onClick={() => {
          onOpen(() => !isOpen);
          link && router.push(link || '#');
        }}
        className={classes.control}
        data-active={matchPath || undefined}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <IconNode size={18} />
            <Box ml="md">{label}</Box>
          </Box>
          {Array.isArray(links) && (
            <IconChevronRight
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: isOpen ? 'rotate(90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {Array.isArray(links) ? <Collapse in={isOpen}>{items}</Collapse> : null}
    </>
  );
};

export default LinksGroup;
