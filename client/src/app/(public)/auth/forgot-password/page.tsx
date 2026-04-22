'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import LoadingButton from '@/components/ui/LoadingButton';
import RHFInput from '@/components/ui/RHF/RHFInput';
import { ForgotPasswordInput, forgotPasswordSchema } from '@/features/auth/schemas';
import { ForgotPasswordDTO } from '@/features/auth/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { IoMailSharp } from 'react-icons/io5';
import { RiResetLeftLine } from 'react-icons/ri';

const ForgotPassword = () => {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordDTO) => {
    console.log(data);
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
              <Button variant={'outline'} className="cursor-pointer" type="button">
                <Link href="login">Cancel</Link>
              </Button>
              <LoadingButton
                label="Reset password"
                type="submit"
                isLoading={false}
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
