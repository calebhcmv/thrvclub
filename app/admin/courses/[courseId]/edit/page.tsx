import { notFound } from 'next/navigation';

import { requireAdminRole } from '@/lib/access/roles';
import { requireSession } from '@/lib/auth/session';
import { CourseForm } from '@/components/forms/course-form';
import { getCourseByIdForUser } from '@/lib/courses/queries';

type EditPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function EditCoursePage({ params }: EditPageProps) {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const { courseId } = await params;
  const course = await getCourseByIdForUser(courseId, session.user.id);

  if (!course) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Editar curso</h1>
      <CourseForm
        mode="edit"
        initialData={{
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnailUrl: course.thumbnailUrl,
          status: course.status,
        }}
      />
    </main>
  );
}
