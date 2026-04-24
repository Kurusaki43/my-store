'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Laptop, Smartphone, Tablet, Globe, Terminal, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Session } from '../types';
import { useAuthStore } from '../store';
import { getSessionIdFromToken } from '@/lib/utils';

const SessionCard = ({
  session: { _id, userAgent, lastUsedAt, expiresAt, ip },
}: {
  session: Session;
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = getSessionIdFromToken(accessToken);
  const isCurrent = sessionId === _id;
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between p-2 sm:p-4 rounded-xl border hover:shadow-md transition relative">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-muted rounded-full">{getDeviceIcon(userAgent)}</div>

        <div className="flex flex-col">
          <span className="font-medium">
            {userAgent ? userAgent.split(' ')[0] : 'Unknown device'}
          </span>

          <span className="text-xs text-muted-foreground">IP: {ip}</span>

          <span className="text-xs text-muted-foreground">
            Last used: {format(new Date(lastUsedAt), 'PPpp')}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {isCurrent && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center justify-center absolute -top-2.5 right-4 bg-lime-500 text-white hover:bg-lime-400"
            >
              Current
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-left">
          <div>Expires: {format(new Date(expiresAt), 'PP')}</div>
        </div>

        <Button
          size="icon"
          variant="outline"
          className="group cursor-pointer size-8"
        >
          <Trash2 size={16} className="group-hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default SessionCard;

export const getDeviceIcon = (ua: string) => {
  const u = ua.toLowerCase();

  if (
    u.includes('postman') ||
    u.includes('insomnia') ||
    u.includes('curl') ||
    u.includes('httpie')
  ) {
    return <Terminal size={16} />;
  }

  if (u.includes('mobile') || u.includes('android') || u.includes('iphone')) {
    return <Smartphone size={16} />;
  }

  if (u.includes('ipad') || u.includes('tablet')) {
    return <Tablet size={16} />;
  }

  if (u.includes('chrome') || u.includes('safari') || u.includes('firefox') || u.includes('edge')) {
    return <Laptop size={16} />;
  }

  return <Globe size={16} />;
};
