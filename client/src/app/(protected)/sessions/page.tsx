'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SessionCard from '@/features/auth/components/SessionCard';
import LogoutAlert from '@/features/auth/components/LogoutAlert';
import { Session } from '@/features/auth/types';

const sessions: Session[] = [];

const SessionsPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-600 to-cyan-400 p-2 sm:p-4">
      <Card className="w-full max-w-5xl shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center sm:text-left">Active Sessions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {sessions.map((s) => (
            <SessionCard key={s._id} session={s} />
          ))}
        </CardContent>
        <CardFooter>
          <LogoutAlert
            btnLabel="Logout all devices"
            alertTitle="Logout from all devices?"
            alertDescription=" This will log you out from all active sessions across all devices. You may also be logged out from this device and will need to sign in again."
            onSuccess={() => console.log('Handle Success')}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default SessionsPage;
