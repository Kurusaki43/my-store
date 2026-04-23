'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import LoadingButton from '@/components/ui/LoadingButton';
import RHFInput from '@/components/ui/RHF/RHFInput';
import { useResetPassword } from '@/features/auth/hook';
import { ResetPasswordInput, resetPasswordSchema } from '@/features/auth/schemas';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FaLock } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';

type Props = {
  params: Promise<{ token: string }>;
};

const ResetPasswordPage = ({ params }: Props) => {
  const { token } = React.use(params);
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });
  const { mutate, isPending, error } = useResetPassword();
  const onSubmit = (data: ResetPasswordInput) => {
    mutate(
      { ...data, token },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription> Choose a new password and confirm it to continue</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-red-500 text-center">{getErrorMessage(error)}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
            <RHFInput<ResetPasswordInput>
              control={form.control}
              name="newPassword"
              label="New Password"
              placeholder="Enter your password"
              type="password"
              Icon={FaLock}
            />
            <RHFInput<ResetPasswordInput>
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Repeat your password"
              type="password"
              Icon={FaLock}
            />

            <div className="text-right">
              <LoadingButton
                label="Confirm"
                type="submit"
                Icon={GiConfirmed}
                isLoading={isPending}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
