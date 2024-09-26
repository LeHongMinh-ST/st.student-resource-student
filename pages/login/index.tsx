import LoginPage from '@/features/login';

export const getStaticProps = async () => ({
  props: {
    layout: 'unLoggedIn',
  },
});

export default LoginPage;
