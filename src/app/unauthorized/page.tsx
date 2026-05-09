export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-primary">403</h1>
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground max-w-md">
          You don&apos;t have permission to access this page. Please contact your administrator.
        </p>
        <a href="/login" className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-all">
          Back to Login
        </a>
      </div>
    </div>
  );
}
