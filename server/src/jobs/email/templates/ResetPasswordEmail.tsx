import {
  Html,
  Head,
  Preview,
  Tailwind,
  Heading,
  Text,
  Button,
  Section,
  Container,
} from '@react-email/components';
import { type ReactElement } from 'react';

interface ResetPasswordEmailProps {
  name: string;
  resetLink: string;
}

export const ResetPasswordEmail = ({ name, resetLink }: ResetPasswordEmailProps): ReactElement => {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your password (valid for 1 hour)</Preview>
      <Tailwind>
        <Section className="bg-gray-50 py-10">
          <Container className="bg-white rounded-xl p-8 max-w-lg mx-auto shadow-sm">
            <Heading className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Reset Your Password
            </Heading>

            <Text className="text-gray-600 mb-6 text-center">
              Hi {name},
              <br />
              You requested to reset your password. This link is valid for <strong>1 hour</strong>.
            </Text>

            <Section className="text-center mb-6">
              <Button
                href={resetLink}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-gray-500 text-sm text-center">
              If you did not request this, you can safely ignore this email.
            </Text>
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
};
