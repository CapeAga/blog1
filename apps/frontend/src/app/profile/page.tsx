'use client';

import UserProfile from '@/components/auth/user-profile';
import { Container } from '@/components/ui/container';
import { Text } from '@/components/ui/text';

export default function ProfilePage() {
  return (
    <Container maxWidth="2xl" paddingX={true} className="py-8">
      <Text variant="h1" weight="bold" className="mb-6">个人中心</Text>
      <UserProfile />
    </Container>
  );
} 