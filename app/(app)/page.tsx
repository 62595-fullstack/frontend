import UserSearch from "@/components/search/UserSearch";

export default function Page() {
  return (
    <div className="page">
      {/* Header row */}
      <div className="flex items-center justify-center w-full max-w-5xl p-8">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Welcome to BookFace</h1>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Find people</h1>
          <p className="mt-1 text-sm text-text-muted">Search for users to view their profile.</p>
        </div>
        <UserSearch />
      </div>
    </div>
  );
}
