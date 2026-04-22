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

const LoginPage = () => {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { mutate, isPending, error } = useLogin();

  const onSubmit = (data: LoginInput) => {
    mutate(data);
    if (!error) form.reset();
  };
  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Login to your account</CardTitle>
        <CardDescription>Enter your credentials below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
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
            <RHFInput<LoginInput>
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              Icon={FaLock}
            />
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
              <Button variant="outline" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
              <p className="text-center mt-2 text-xs">
                Don&apos;t have an account?{' '}
                <Link href="register" className="hover:underline font-bold">
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
