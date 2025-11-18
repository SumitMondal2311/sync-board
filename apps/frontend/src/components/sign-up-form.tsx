"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "@repo/types";
import { authSchema } from "@repo/validation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export const SignUpForm = ({
    setReadyForVerification,
    setEmail,
}: {
    setEmail: (_: string) => void;
    setReadyForVerification: (_: boolean) => void;
}) => {
    const form = useForm<AuthSchema>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const email = useWatch({
        control: form.control,
        name: "email",
    });

    const onSubmit = useCallback(async () => {
        await new Promise(() =>
            setTimeout(() => {
                setEmail(email);
                setReadyForVerification(true);
                form.reset();
            }, 2000)
        );
    }, [email, setEmail, setReadyForVerification, form]);

    return (
        <Card className="w-full max-w-sm">
            {form.formState.isSubmitting ? (
                <div className="bg-background/50 absolute inset-0 rounded-md" />
            ) : null}
            <CardHeader className="gap-0">
                <CardTitle className="font-mono">Get started</CardTitle>
                <CardDescription>
                    Please fill in the credentials below to create an account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline">Google</Button>
                <Button variant="outline">GitHub</Button>
            </CardContent>
            <Separator />
            <CardContent>
                <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="email" className="w-max!">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        tabIndex={0}
                                        type="email"
                                        id="email"
                                        required
                                        placeholder="yourname@example.com"
                                        {...field}
                                    />
                                    {fieldState.invalid ? (
                                        <FieldError errors={[fieldState.error]} />
                                    ) : null}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="password" className="w-max!">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        tabIndex={1}
                                        type="password"
                                        id="password"
                                        required
                                        {...field}
                                    />
                                    {fieldState.invalid ? (
                                        <FieldError errors={[fieldState.error]} />
                                    ) : null}
                                </Field>
                            )}
                        />
                        <Field>
                            <Button disabled={form.formState.isSubmitting} type="submit">
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                            <FieldDescription className="flex items-center justify-center gap-2">
                                Already have an account?
                                <Link href="/sign-in">Sign in</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};
