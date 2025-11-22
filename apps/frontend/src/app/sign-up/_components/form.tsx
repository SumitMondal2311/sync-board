"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "@repo/types";
import { authSchema } from "@repo/validation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { SocialAuthButtonGroup } from "@/components/social-auth-button-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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

    const onSubmit = async (data: AuthSchema) => {
        await new Promise((r) => setTimeout(r, 1000));
        setEmail(data.email);
        setReadyForVerification(true);
        form.reset();
    };

    return (
        <Card className="w-full max-w-sm">
            {form.formState.isSubmitting ? (
                <div className="bg-background/50 absolute inset-0 z-10 rounded-md" />
            ) : null}
            <CardHeader className="gap-0">
                <CardTitle className="font-mono text-2xl">Get started</CardTitle>
                <CardDescription>
                    Please fill in the credentials below to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SocialAuthButtonGroup />
                <Separator className="my-6" />
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
                                <Link
                                    href="/sign-in"
                                    className="text-primary! font-medium! no-underline! hover:underline!"
                                >
                                    Sign in
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};
