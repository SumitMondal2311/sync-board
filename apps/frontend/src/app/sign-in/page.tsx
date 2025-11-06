import { SignInForm } from "@/features/auth/components/sign-in-form";

export default function SignInPage() {
    return (
        <div className="flex h-screen items-center justify-center px-4">
            <div className="relative w-full max-w-sm rounded-md border p-8 shadow-md">
                <SignInForm />
            </div>
        </div>
    );
}
