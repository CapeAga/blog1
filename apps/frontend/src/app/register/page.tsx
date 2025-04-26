'use client';

import RegisterForm from '@/components/auth/register-form';
import { Container } from '@/components/ui/container';
import { Text } from '@/components/ui/text';

export default function RegisterPage() {
  return (
    <Container maxWidth="2xl" paddingX={true} className="py-8">
      <Text variant="h1" weight="bold" className="mb-6 text-center">用户注册</Text>
      <RegisterForm />
    </Container>
  );
} 