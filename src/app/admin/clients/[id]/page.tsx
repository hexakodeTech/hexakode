import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ClientDetailsView from '@/components/admin/ClientDetailsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Details | HexaKode Console',
  description: 'View and manage client profile, website URL, and associated projects.',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminClientDetailsPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminLayout>
      <ClientDetailsView id={id} />
    </AdminLayout>
  );
}
