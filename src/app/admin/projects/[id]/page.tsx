import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProjectDetailsView from '@/components/admin/ProjectDetailsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Details | HexaKode Console',
  description: 'View and manage project details, website URLs, and maintenance history.',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectDetailsPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminLayout>
      <ProjectDetailsView id={id} />
    </AdminLayout>
  );
}
