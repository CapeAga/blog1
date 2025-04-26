'use client';

import LoginForm from '@/components/auth/login-form';
import { Container } from '@/components/ui/container';
import { Text } from '@/components/ui/text';

export default function LoginPage() {
  return (
    <Container maxWidth="2xl" paddingX={true} className="py-8">
      <Text variant="h1" weight="bold" className="mb-6 text-center">用户登录</Text>
      <LoginForm />
    </Container>
  );
} 