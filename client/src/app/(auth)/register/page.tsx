'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldSeparator } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import LoadingButton from '@/components/ui/LoadingButton';
import RHFInput from '@/components/ui/RHF/RHFInput';
import { RegisterInput, registerSchema } from '@/features/auth/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaLock } from 'react-icons/fa';
import { IoLogInOutline, IoMailSharp } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { useRegister } from '@/features/auth/hook';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import GoogleAuthButton from '@/features/auth/components/GoogleAuthButton';

const RegisterPage = () => {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { mutate, isPending, error } = useRegister();
  const onSubmit = (data: RegisterInput) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(`Account created! Welcome, ${res.data.user.name} 👋`);
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
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Sign up to explore products and start your orders</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-red-500 text-center">{getErrorMessage(error)}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
            <RHFInput<RegisterInput>
              control={form.control}
              name="name"
              label="Name"
              placeholder="Enter your name"
              type="text"
              Icon={FaUser}
            />
            <RHFInput<RegisterInput>
              control={form.control}
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              type="email"
              Icon={IoMailSharp}
            />
            <RHFInput<RegisterInput>
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              Icon={FaLock}
            />
            <RHFInput<RegisterInput>
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Repeat your password"
              type="password"
              Icon={FaLock}
            />

            {/* Submit */}
            <Field>
              <LoadingButton
                label="Register"
                type="submit"
                Icon={IoLogInOutline}
                isLoading={isPending}
              />

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-3">
                Or continue with
              </FieldSeparator>
              <GoogleAuthButton />
              <p className="text-center mt-2 text-xs">
                Already have an account?{' '}
                <Link href="/login" className="hover:underline font-bold">
                  Login
                </Link>
              </p>
            </Field>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
