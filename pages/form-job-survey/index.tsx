import JobSurveyPage from '@/features/form/job-survey';

export const getStaticProps = async () => ({
  props: {
    layout: 'unLoggedIn',
  },
});

export default JobSurveyPage;
