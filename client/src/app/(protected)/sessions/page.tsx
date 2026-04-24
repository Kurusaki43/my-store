'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SessionCard from '@/features/auth/components/SessionCard';
import LogoutAlert from '@/features/auth/components/LogoutAlert';
import { useGetSessions, useLogoutAllSessions } from '@/features/auth/hook';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SessionsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: resData, isPending, error, isError, isSuccess } = useGetSessions();
  const { mutate, isPending: isLoggingOutSessions } = useLogoutAllSessions();
  const sessions = resData?.data?.sessions ?? [];
  const handleLogoutAllSessions = () => {
    mutate(undefined, {
      onSuccess: (res) => {
        router.replace('/login');
        toast.success(res.message);
        queryClient.clear();
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
      },
    });
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-600 to-cyan-400 p-2 sm:p-4 ">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center sm:text-left">Active Sessions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {isPending && (
            <div className="p-5 flex flex-col gap-2 items-center justify-center">
              <span className="size-8 border-3 border-blue-500 border-t-transparent animate-spin rounded-full" />
              <p className="tracking-wide text-blue-500 animate-pulse font-semibold">
                Loading Sessions
              </p>
            </div>
          )}
          {isError && (
            <div className="p-5 flex flex-col gap-2 items-center justify-center">
              <p className="text-red-400">{getErrorMessage(error)}</p>
            </div>
          )}
          {sessions.map((s) => (
            <SessionCard key={s._id} session={s} />
          ))}
        </CardContent>
        {isSuccess && (
          <CardFooter>
            <Link href="/">Go to Home</Link>
            <LogoutAlert
              btnLabel="Logout all devices"
              alertTitle="Logout from all devices?"
              alertDescription=" This will log you out from all active sessions across all devices. You may also be logged out from this device and will need to sign in again."
              onSuccess={handleLogoutAllSessions}
              loading={isLoggingOutSessions}
              disableBtn={isLoggingOutSessions}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default SessionsPage;
