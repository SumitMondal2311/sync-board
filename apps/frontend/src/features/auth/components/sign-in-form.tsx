"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@repo/types";
import { signInSchema } from "@repo/validation";
import { Loader } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSignIn } from "../hooks/use-sign-in";
import { OAuthProviders } from "./oauth-providers";

export const SignInForm = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { mutate: signIn, isPending, isError } = useSignIn();

    const { handleSubmit, control, formState } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
    });

    React.useEffect(() => {
        if (formState.isSubmitting || isPending) {
            setIsLoading(true);
        } else {
            if (isError) setIsLoading(false);
        }
    }, [formState, isPending, setIsLoading, isError]);

    const onSubmit = (formData: SignInSchema) => {
        signIn(formData);
    };

    return (
        <Card className="w-full max-w-sm">
            {isLoading ? <div className="bg-background/50 absolute inset-0 rounded-md" /> : null}
            <CardHeader className="gap-0">
                <CardTitle className="font-mono text-2xl">Welcome back</CardTitle>
                <CardDescription>
                    Please fill in the credentials below to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <OAuthProviders />
                <Separator className="my-6" />
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                    <FieldSet>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        tabIndex={1}
                                        type="email"
                                        id="email"
                                        autoComplete="email"
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
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2">
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Link
                                            href="#"
                                            className="text-primary text-sm font-medium hover:underline hover:underline-offset-4"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        tabIndex={2}
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        required
                                        {...field}
                                    />
                                    {fieldState.invalid ? (
                                        <FieldError errors={[fieldState.error]} />
                                    ) : null}
                                </Field>
                            )}
                        />
                        <div className="grid gap-6">
                            <Button disabled={isLoading} type="submit">
                                {isLoading ? <Loader className="animate-spin" /> : null}
                                Continue
                            </Button>
                            <p className="flex items-center justify-center gap-2 text-sm">
                                Don&apos;t have an account?
                                <Link
                                    href="/sign-up"
                                    className="text-primary font-medium underline-offset-4 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </FieldSet>
                </form>
            </CardContent>
        </Card>
    );
};
