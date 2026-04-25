'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import LoadingButton from '@/components/ui/LoadingButton';
import RHFInput from '@/components/ui/RHF/RHFInput';
import { useForgotPassword } from '@/features/auth/hook';
import { ForgotPasswordInput, forgotPasswordSchema } from '@/features/auth/schemas';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoMailSharp } from 'react-icons/io5';
import { RiResetLeftLine } from 'react-icons/ri';

const ForgotPassword = () => {
  const router = useRouter();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const { mutate, isPending, error } = useForgotPassword();
  const onSubmit = (data: ForgotPasswordInput) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.replace('/');
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
      },
    });
  };
  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Forgot password</CardTitle>
        <CardDescription>
          Provide your email and we’ll send you a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-red-500 text-center">{getErrorMessage(error)}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
            <RHFInput<ForgotPasswordInput>
              control={form.control}
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              type="email"
              Icon={IoMailSharp}
            />

            <div className="flex justify-between">
              <Button variant={'outline'} className="cursor-pointer" type="button" asChild>
                <Link href="/login">Cancel</Link>
              </Button>
              <LoadingButton
                label="Reset password"
                type="submit"
                isLoading={isPending}
                Icon={RiResetLeftLine}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
