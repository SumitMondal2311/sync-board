"use client";

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { apiClient } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerificationCodeSchema } from "@repo/types";
import { verificationCodeSchema } from "@repo/validation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { MoveLeft } from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SignUpState } from "./sign-up-controller";

export function SignUpVerificationForm({
    setSignUpState,
}: {
    setSignUpState: (state: SignUpState) => void;
}) {
    const router = useRouter();

    const { mutate, isSuccess } = useMutation<void, AxiosError<ApiError>, VerificationCodeSchema>({
        mutationFn: (data) => apiClient.post("/api/v1/auth/sign-up/verify", data),
        onError: (error) => {
            toast.error(error.response?.data.message || "Unknown error");
        },
        onSuccess: () => {
            form.reset({ code: "" });
            router.push("/dashboard");
        },
    });

    const form = useForm<VerificationCodeSchema>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: "",
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        form.setFocus("code");
    }, [form]);

    const onSubmit = useCallback(
        (data: VerificationCodeSchema) => {
            mutate(data);
        },
        [mutate]
    );

    const code = form.watch("code");
    useEffect(() => {
        if (code.length === 6) {
            void form.handleSubmit(onSubmit)();
        }
    }, [code, form, onSubmit]);

    return (
        <div className="pt-4">
            {isSuccess ? (
                <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-white">
                    Authorizing...
                </div>
            ) : null}
            <span
                onClick={() => setSignUpState("sign-up")}
                className="text-muted-foreground hover:text-foreground absolute top-4 left-4 flex cursor-pointer items-center space-x-2 text-sm transition-colors hover:underline"
            >
                <MoveLeft size={16} />
                <span>Back</span>
            </span>
            <FieldSet>
                <FieldContent className="gap-0 text-center">
                    <FieldLegend className="font-mono text-2xl!">Verify your email</FieldLegend>
                    <FieldDescription>
                        If you don&apos;t have an account yet, we&apos;ve send a code to
                        yourname@example.com. Enter it below.
                    </FieldDescription>
                </FieldContent>
                <FieldGroup>
                    <Controller
                        name="code"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                                    <InputOTPGroup className="w-full justify-evenly">
                                        {Array.from({ length: 6 }, (_, idx) => (
                                            <InputOTPSlot
                                                index={idx}
                                                key={idx}
                                                className="size-10 rounded! border! shadow-none!"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-center"
                                    />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="space-x-2 self-center text-sm">
                    <span>Didn&apos;t receive a code?</span>
                    <Link href="#" className="text-blue-600 hover:underline">
                        Resend
                    </Link>
                </div>
            </FieldSet>
        </div>
    );
}
