'use client';

import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';
import { Control, FieldValues, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { type IconType } from 'react-icons';

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
  ...props
}: RHFInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="inline-block" htmlFor={name}>
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
                  className={cn('py-4.5', Icon && 'pl-8', className)}
                />
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default RHFInput;
