import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-3xl font-bold text-primary mb-6">Welcome Back</h1>
        <LoginForm />
      </div>
    </main>
  );
}
