'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldSeparator } from '@/components/ui/field';
import Link from 'next/link';
import RHFInput from '@/components/ui/RHF/RHFInput';
import { FaLock } from 'react-icons/fa';
import { IoMailSharp } from 'react-icons/io5';
import { IoLogInOutline } from 'react-icons/io5';
import { LoginInput, loginSchema } from '@/features/auth/schemas';
import LoadingButton from '@/components/ui/LoadingButton';
import { useLogin } from '@/features/auth/hook';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import GoogleAuthButton from '@/features/auth/components/GoogleAuthButton';

const LoginPage = () => {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { mutate, isPending, error } = useLogin();

  const onSubmit = (data: LoginInput) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(`Welcome, ${res.data.user.name} 👋`);
        router.replace('/sessions');
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };
  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Login to your account</CardTitle>
        <CardDescription>Enter your credentials below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-red-500 text-center">{getErrorMessage(error)}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
            <RHFInput<LoginInput>
              control={form.control}
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              type="email"
              Icon={IoMailSharp}
            />
            <div className="flex flex-col gap-1">
              <RHFInput<LoginInput>
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                Icon={FaLock}
              />

              <Link
                href="/forgot-password"
                className="ml-auto text-xs hover:underline underline-offset-1 text-blue-400 font-bold"
              >
                Forgot Password
              </Link>
            </div>
            <Field>
              <LoadingButton
                label="Login"
                type="submit"
                Icon={IoLogInOutline}
                isLoading={isPending}
              />

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-3">
                Or continue with
              </FieldSeparator>
              <GoogleAuthButton />
              <p className="text-center mt-2 text-xs">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="hover:underline font-bold">
                  Sign up
                </Link>
              </p>
            </Field>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
