"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "@repo/types";
import { authSchema } from "@repo/validation";
import { Loader } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { SocialAuthButtonGroup } from "@/components/social-auth-button-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSignIn } from "@/hooks/mutations/use-sign-in";
import { cn } from "@/lib/utils";

export const SignInForm = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { mutate, isPending } = useSignIn();

    const form = useForm<AuthSchema>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    React.useEffect(() => {
        if (form.formState.isSubmitting || isPending) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [form, isPending, setIsLoading]);

    const onSubmit = (formData: AuthSchema) => {
        mutate(formData);
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
                <SocialAuthButtonGroup />
                <Separator className="my-6" />
                <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        tabIndex={1}
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
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Link
                                            href="#"
                                            className={cn(
                                                buttonVariants({ variant: "link" }),
                                                "h-max! p-0! font-normal!"
                                            )}
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
                            <Button disabled={isLoading} type="submit">
                                {isLoading ? <Loader className="animate-spin" /> : null}
                                Continue
                            </Button>
                            <FieldDescription className="flex items-center justify-center gap-2">
                                Don&apos;t have an account?
                                <Link
                                    href="/sign-up"
                                    className="text-primary! no-underline! hover:underline!"
                                >
                                    Sign up
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};
