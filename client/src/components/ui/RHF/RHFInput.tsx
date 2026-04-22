'use client';

import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';
import { Control, FieldValues, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { type IconType } from 'react-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type RHFInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  Icon?: IconType;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RHFInput = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  Icon,
  type,
  ...props
}: RHFInputProps<T>) => {
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="inline-block text-black" htmlFor={name}>
              {label}
            </FormLabel>

            <FormControl>
              <div className="relative">
                {Icon && (
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                )}

                <Input
                  id={name}
                  {...props}
                  {...field}
                  type={type !== 'password' ? type : visible ? 'text' : 'password'}
                  className={cn('py-4.5', Icon && 'pl-8', className)}
                />
                {type === 'password' && (
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setVisible((prev) => !prev)}
                  >
                    {visible ? <FaEye /> : <FaEyeSlash />}
                  </div>
                )}
              </div>
            </FormControl>

            <FormMessage className="text-xs font-light" />
          </FormItem>
        );
      }}
    />
  );
};

export default RHFInput;
