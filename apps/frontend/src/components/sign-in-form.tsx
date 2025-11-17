"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "@repo/types";
import { authSchema } from "@repo/validation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export const SignInForm = () => {
    const router = useRouter();

    const form = useForm<AuthSchema>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            emailAddress: "",
            password: "",
        },
        mode: "onTouched",
    });

    const onSubmit = useCallback(async () => {
        await new Promise(() =>
            setTimeout(() => {
                router.push("/dashboard");
                form.reset();
            }, 2000)
        );
    }, [router, form]);

    return (
        <Card className="w-full max-w-sm">
            {form.formState.isSubmitting ? (
                <div className="bg-background/50 absolute inset-0 rounded-md" />
            ) : null}
            <CardHeader className="gap-0">
                <CardTitle className="font-mono text-2xl">Welcome back</CardTitle>
                <CardDescription>
                    Please fill in the credentials below to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 pb-6">
                    <Button variant="outline">Continue with Google</Button>
                    <Button variant="outline">Continue with GitHub</Button>
                </div>
                <Separator />
                <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="pt-6">
                    <FieldGroup>
                        <Controller
                            name="emailAddress"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="email-address">Email Address</FieldLabel>
                                    <Input
                                        tabIndex={1}
                                        type="email"
                                        id="email-address"
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
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Link
                                            href="#"
                                            className="text-muted-foreground hover:text-foreground text-sm underline transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        tabIndex={2}
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
                                Don&apos;t have an account?
                                <Link href="/sign-up">Sign up</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};
