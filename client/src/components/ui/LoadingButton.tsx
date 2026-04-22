import { HTMLAttributes } from 'react';
import { Button, ButtonProps } from './button';
import { LuLoader } from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';

type LoadingButtonProps = {
  isLoading?: boolean;
  label: string;
  Icon?: IconType;
} & HTMLAttributes<HTMLButtonElement> &
  ButtonProps;

const LoadingButton = ({
  isLoading = false,
  label,
  Icon,
  disabled = false,
  className,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={disabled || isLoading}
      className={cn('cursor-pointer font-bold', className)}
      {...props}
    >
      {Icon && <Icon />}
      {isLoading ? (
        <div className="flex gap-1 items-center">
          {label}
          <LuLoader className="animate-spin" />
        </div>
      ) : (
        label
      )}
    </Button>
  );
};

export default LoadingButton;
