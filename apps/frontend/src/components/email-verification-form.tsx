"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VerificationCodeSchema } from "@repo/types";
import { verificationCodeSchema } from "@repo/validation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2, MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldDescription, FieldError, FieldGroup } from "./ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

export const EmailVerificationForm = ({
    setReadyForVerification,
    email,
}: {
    email: string;
    setReadyForVerification: (state: boolean) => void;
}) => {
    const router = useRouter();

    const form = useForm<VerificationCodeSchema>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: "",
        },
        mode: "onSubmit",
    });

    const code = useWatch({
        control: form.control,
        name: "code",
    });

    useEffect(() => {
        form.setFocus("code");
    }, [form]);

    const onSubmit = useCallback(async () => {
        await new Promise(() =>
            setTimeout(() => {
                router.push("/dashboard");
                form.reset();
            }, 2000)
        );
    }, [router, form]);

    return (
        <Card className="relative w-full max-w-sm">
            {form.formState.isSubmitting ? (
                <div className="bg-background/50 absolute inset-0 z-10 rounded-md" />
            ) : null}
            <Button
                disabled={form.formState.isSubmitting}
                variant="link"
                onClick={() => setReadyForVerification(false)}
                className="absolute -top-10 left-0"
            >
                <MoveLeft />
                Back
            </Button>
            <CardHeader className="gap-0">
                <CardTitle className="font-mono text-2xl">Verify your email</CardTitle>
                <CardDescription>
                    If you don&apos;t have an account yet, we&apos;ve sent a code to {email}. Enter
                    it below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
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
                                    {fieldState.invalid ? (
                                        <FieldError
                                            errors={[fieldState.error]}
                                            className="text-center"
                                        />
                                    ) : null}
                                </Field>
                            )}
                        />
                        <Field>
                            <Button disabled={code.length !== 6} type="submit">
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                            <FieldDescription className="flex items-center justify-center gap-2">
                                Didn&apos;t receive a code?
                                <Button type="button" variant="link">
                                    Resend
                                </Button>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};
