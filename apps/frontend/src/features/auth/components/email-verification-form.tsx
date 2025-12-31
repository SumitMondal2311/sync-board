"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyEmailSchema } from "@repo/types/api";
import { verifyEmailSchema } from "@repo/validation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldSet } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAttemptVerifyEmail } from "../hooks/use-attempt-verify-email";
import { usePrepareVerifyEmail } from "../hooks/use-prepare-verify-email";

export const EmailVerificationForm = () => {
    const prepareVerifyEmail = usePrepareVerifyEmail();
    const attemptVerifyEmail = useAttemptVerifyEmail();
    const router = useRouter();

    const { handleSubmit, control, formState, setFocus, reset } = useForm<VerifyEmailSchema>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            code: "",
        },
        mode: "onSubmit",
    });

    React.useEffect(() => {
        if (prepareVerifyEmail.isError) {
            router.replace("/sign-up");
        }
    }, [prepareVerifyEmail, router]);

    React.useEffect(() => {
        setFocus("code");
    }, [setFocus]);

    React.useEffect(() => {
        if (attemptVerifyEmail.isError) {
            reset({ code: "" });
        }
    }, [attemptVerifyEmail, reset]);

    const { code } = useWatch({ control });

    const onSubmit = (data: VerifyEmailSchema) => {
        attemptVerifyEmail.mutate(data);
    };

    if (prepareVerifyEmail.isLoading || prepareVerifyEmail.isError) {
        return null;
    }

    return (
        <Card className="relative w-full max-w-sm">
            {formState.isSubmitting || attemptVerifyEmail.isPending ? (
                <div className="bg-background/50 absolute inset-0 z-10 rounded-md" />
            ) : null}
            <CardHeader className="gap-0">
                <CardTitle className="font-mono text-2xl">Verify your email</CardTitle>
                <CardDescription>
                    If you don&apos;t have an account yet, we&apos;ve sent a code to{" "}
                    {prepareVerifyEmail.data?.data.maskedEmail}. Enter it below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                    <FieldSet>
                        <Controller
                            name="code"
                            control={control}
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
                                    {fieldState.invalid ? (
                                        <FieldError
                                            errors={[fieldState.error]}
                                            className="text-center"
                                        />
                                    ) : null}
                                </Field>
                            )}
                        />
                        <div className="grid gap-6">
                            <Button disabled={code?.length !== 6} type="submit">
                                {formState.isSubmitting || attemptVerifyEmail.isPending ? (
                                    <Loader className="animate-spin" />
                                ) : null}
                                Continue
                            </Button>
                            <p className="flex items-center justify-center gap-2">
                                Didn&apos;t receive a code?
                                <Button variant="link" className="h-max! p-0!">
                                    Resend
                                </Button>
                            </p>
                        </div>
                    </FieldSet>
                </form>
            </CardContent>
        </Card>
    );
};
