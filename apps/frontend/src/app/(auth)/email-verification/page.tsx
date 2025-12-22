import { EmailVerificationForm } from "@/features/auth/components/email-verification-form";

export default function Page() {
    return (
        <div className="flex h-screen items-center justify-center px-6">
            <EmailVerificationForm />
        </div>
    );
}
