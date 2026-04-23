import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type LogoutAlertProps = {
  btnLabel: string;
  alertTitle: string;
  alertDescription: string;
  onSuccess: () => void;
  loading?: boolean;
  disableBtn?: boolean;
};

const LogoutAlert = ({
  btnLabel,
  alertTitle,
  alertDescription,
  onSuccess,
  loading = false,
  disableBtn = false,
}: LogoutAlertProps) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={disableBtn}
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
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button onClick={onSuccess} disabled={loading}>
            {loading ? 'Loading...' : 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlert;
