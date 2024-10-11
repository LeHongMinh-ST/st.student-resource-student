import { useAuthStore } from '@/utils/recoil/auth/authState';

const ProfilePage = () => {
  const auth = useAuthStore();
  const student = auth.authUser;

  return (
    <>
      Profile {student?.last_name} {student?.first_name}
    </>
  );
};

export default ProfilePage;
