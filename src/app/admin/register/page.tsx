import RegisterForm from '@/components/admin/RegisterForm';

export default function AdminRegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-center text-3xl font-bold text-primary mb-6">Create an Account</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
