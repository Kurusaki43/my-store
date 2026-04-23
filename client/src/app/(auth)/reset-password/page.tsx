'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import LoadingButton from '@/components/ui/LoadingButton';
import RHFInput from '@/components/ui/RHF/RHFInput';
import { ResetPasswordInput, resetPasswordSchema } from '@/features/auth/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaLock } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';

const ResetPasswordPage = () => {
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    console.log(data);
  };

  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription> Choose a new password and confirm it to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
            <RHFInput<ResetPasswordInput>
              control={form.control}
              name="password"
              label="Password"
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
              <LoadingButton label="Confirm" type="submit" Icon={GiConfirmed} isLoading={false} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
