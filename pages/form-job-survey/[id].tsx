import { GetStaticProps } from 'next';
import JobSurveyPage from '@/features/form/job-survey';
import { useSurveyPeriodService } from '@/services/surveyPeriodService';
import { useTrainingIndustryService } from '@/services/trainingIndustryService';

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params || {};

  const surveyPeriodService = useSurveyPeriodService();
  const trainingIndustryService = useTrainingIndustryService();

  if (typeof id === 'string') {
    try {
      const res = await surveyPeriodService.getSurveyPeriod(id);
      if (!res.data) {
        throw new Error('Survey period not found');
      }
      const surveyPeriod = res.data.data;

      const trainingIndustryRes = await trainingIndustryService.getList({
        faculty_id: surveyPeriod.faculty_id,
      });

      const dataOptionTrainingIndustries = trainingIndustryRes.data.data.map((item) => ({
        label: item.name,
        value: String(item.id),
      }));

      return {
        props: {
          layout: 'unLoggedIn',
          surveyPeriod,
          dataOptionTrainingIndustries,
        },
      };
    } catch (error) {
      return {
        notFound: true,
      };
    }
  }
  return {
    notFound: true,
  };
};

export const getStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export default JobSurveyPage;
