import { Html, Tailwind, Heading, Text, Button, Section } from '@react-email/components';
import { type ReactElement } from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps): ReactElement => {
  return (
    <Tailwind>
      <Html lang="en">
        <Section className="bg-gray-50 min-h-screen flex items-center justify-center">
          <Section className="bg-white rounded-xl p-10 max-w-lg mx-auto shadow-sm">
            <Heading className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to MyStore, {name}! 👋
            </Heading>
            <Text className="text-gray-500 mb-6">
              We're glad to have you. Start exploring our products and find something you love.
            </Text>
            <Button
              href={process.env.CLIENT_URL}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium mx-auto"
            >
              Shop Now
            </Button>
          </Section>
        </Section>
      </Html>
    </Tailwind>
  );
};
