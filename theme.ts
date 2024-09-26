import { ActionIcon, createTheme, Loader, MantineColorsTuple } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#ecf6fe',
  '#d8eaf7',
  '#acd4f1',
  '#7dbdec',
  '#5aaae8',
  '#479de6',
  '#3c97e6',
  '#2f83cd',
  '#2475b8',
  '#0b65a2',
];

export const theme = createTheme({
  colors: {
    myColor,
  },
  focusRing: 'always',
  fontFamily: 'Open Sans, sans-serif',
  headings: { fontFamily: 'Open Sans, sans-serif' },
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        type: 'bars',
      },
    }),
  },
});
