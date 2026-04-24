import { Button } from '@/components/ui/button';
import { useLogout } from './hook';

const LogoutButton = () => {
  const { mutate: logout } = useLogout();
  return (
    <Button
      className="absolute top-10 right-10 rounded-full bg-slate-600 font-bold cursor-pointer hover:bg-slate-700"
      onClick={() => logout()}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
