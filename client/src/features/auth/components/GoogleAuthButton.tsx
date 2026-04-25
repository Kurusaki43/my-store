import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '../hook';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/lib/getErrorMessage';

const GoogleAuthButton = () => {
  const router = useRouter();
  const { mutate: loginByGoogle } = useGoogleAuth();
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const idToken = credentialResponse.credential;
        loginByGoogle(
          { idToken: idToken! },
          {
            onSuccess: (res) => {
              toast.success(`Welcome, ${res.data.user.name} 👋`);
              router.replace('/sessions');
            },
            onError: (err) => {
              toast.error(getErrorMessage(err));
            },
          },
        );
      }}
      onError={() => toast.error('Login Failed, Try again')}
    />
  );
};

export default GoogleAuthButton;
