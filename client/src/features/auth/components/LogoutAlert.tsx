import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type LogoutAlertProps = {
  btnLabel: string;
  alertTitle: string;
  alertDescription: string;
  onSuccess: () => void;
  loading?: boolean;
};

const LogoutAlert = ({
  btnLabel,
  alertTitle,
  alertDescription,
  onSuccess,
  loading = false,
}: LogoutAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="text-white font-bold cursor-pointer mx-auto sm:ml-auto sm:mr-0"
        >
          {btnLabel || 'Logout'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSuccess} disabled={loading}>
            {loading ? 'Loading...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlert;
