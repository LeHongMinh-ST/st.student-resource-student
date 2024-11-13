import JobSurveyPage from '@/features/form/job-survey';

export const getStaticProps = async () => ({
  props: {
    layout: 'unLoggedIn',
  },
});

export const getStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export default JobSurveyPage;
