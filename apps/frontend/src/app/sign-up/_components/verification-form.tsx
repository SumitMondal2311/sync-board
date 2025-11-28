"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VerificationCodeSchema } from "@repo/types";
import { verificationCodeSchema } from "@repo/validation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader, MoveLeft } from "lucide-react";
import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useSignUpVerification } from "@/hooks/mutations/use-sign-up-verification";

export const SignUpVerificationForm = ({
    setReadyForVerification,
    email,
}: {
    email: string;
    setReadyForVerification: (state: boolean) => void;
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { mutate, isPending, isError } = useSignUpVerification();

    const form = useForm<VerificationCodeSchema>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: "",
        },
        mode: "onSubmit",
    });

    React.useEffect(() => {
        form.setFocus("code");
    }, [form]);

    React.useEffect(() => {
        if (isError) {
            form.reset();
        }
    }, [isError, form]);

    React.useEffect(() => {
        if (form.formState.isSubmitting || isPending) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [form, isPending, setIsLoading]);

    const { code } = useWatch({ control: form.control });

    const onSubmit = (data: VerificationCodeSchema) => {
        mutate(data);
    };

    return (
        <Card className="relative w-full max-w-sm">
            {isLoading ? (
                <div className="bg-background/50 absolute inset-0 z-10 rounded-md" />
            ) : null}
            <Button
                disabled={isLoading}
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
                            <Button disabled={code?.length !== 6} type="submit">
                                {isLoading ? <Loader className="animate-spin" /> : null}
                                Continue
                            </Button>
                            <FieldDescription className="flex items-center justify-center gap-2">
                                Didn&apos;t receive a code?
                                <Button variant="link" className="h-max! p-0!">
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
