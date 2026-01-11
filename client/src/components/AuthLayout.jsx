export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-10 backdrop-blur-md bg-black/40 border border-white/10">
        {children}
      </div>
    </div>
  );
}