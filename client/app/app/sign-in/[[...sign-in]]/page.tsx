import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-teal-800 mb-6">Welcome Back</h1>
          <SignIn appearance={{
            elements: {
              formButtonPrimary: "bg-teal-600 hover:bg-teal-700 transition-colors", 
              card: "shadow-none border-0",
              headerTitle: "hidden",
              formFieldInput: "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            }
          }} />
        </div>
      </div>
    </div>
  );
}