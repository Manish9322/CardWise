'use client';

import { Suspense } from 'react';
import ManageQuestions from '@/components/admin/questions-table/ManageQuestions';
import { ManageQuestionsSkeleton } from '@/components/admin/skeletons/ManageQuestionsSkeleton';

export default function ManageQuestionsPage() {
  return (
    <Suspense fallback={<ManageQuestionsSkeleton />}>
      <ManageQuestions />
    </Suspense>
  );
}
