import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProjectDetailsView from '@/components/admin/ProjectDetailsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Details | HexaKode Console',
  description: 'View and manage project details, website URLs, maintenance logs, and invoices.',
};

interface Props {
  params: Promise<{ id: string; projectId: string }>;
}

export default async function AdminProjectDetailsPage({ params }: Props) {
  const { id: clientId, projectId } = await params;
  return (
    <AdminLayout>
      <ProjectDetailsView clientId={clientId} projectId={projectId} />
    </AdminLayout>
  );
}
