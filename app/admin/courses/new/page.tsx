import { requireAdminRole } from '@/lib/access/roles';
import { requireSession } from '@/lib/auth/session';
import { CourseForm } from '@/components/forms/course-form';

export default async function NewCoursePage() {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Novo curso</h1>
      <CourseForm mode="create" />
    </main>
  );
}
