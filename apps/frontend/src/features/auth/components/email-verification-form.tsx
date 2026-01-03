"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyEmailSchema } from "@repo/types";
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
    const router = useRouter();

    const {
        isLoading: isPreparing,
        isError: isPrepareError,
        data: prepareData,
    } = usePrepareVerifyEmail();

    React.useEffect(() => {
        if (isPrepareError) {
            router.replace("/sign-up");
        }
    }, [isPrepareError, router]);

    const {
        mutate: attemptVerifyEmail,
        isPending: isAttempting,
        isError: isAttemptError,
        isSuccess: isAttemptSuccess,
    } = useAttemptVerifyEmail();

    const { handleSubmit, control, setFocus, reset } = useForm<VerifyEmailSchema>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            code: "",
        },
        mode: "onSubmit",
    });

    const { code } = useWatch({ control });
    React.useEffect(() => {
        if (isAttemptError) {
            reset({ code: "" });
        }
    }, [isAttemptError, reset]);

    const onSubmit = (data: VerifyEmailSchema) => {
        attemptVerifyEmail(data);
    };

    if (isPreparing || isPrepareError) {
        return null;
    }

    return (
        <Card className="relative w-full max-w-sm">
            {isAttempting || isAttemptSuccess ? (
                <div className="bg-background/50 absolute inset-0 z-10 rounded-md" />
            ) : null}
            <CardHeader className="gap-0">
                <CardTitle className="font-mono text-2xl">Verify your email</CardTitle>
                <CardDescription>
                    If you don&apos;t have an account yet, we&apos;ve sent a code to{" "}
                    {prepareData?.data.maskedEmail}. Enter it below.
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
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        autoFocus
                                        {...field}
                                    >
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
                                {isAttempting || isAttemptSuccess ? (
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
