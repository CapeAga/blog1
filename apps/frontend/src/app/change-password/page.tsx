'use client';

import ChangePasswordForm from '@/components/auth/change-password';
import { Container } from '@/components/ui/container';
import { Text } from '@/components/ui/text';

export default function ChangePasswordPage() {
  return (
    <Container maxWidth="2xl" paddingX={true} className="py-8">
      <Text variant="h1" weight="bold" className="mb-6">修改密码</Text>
      <ChangePasswordForm />
    </Container>
  );
} 