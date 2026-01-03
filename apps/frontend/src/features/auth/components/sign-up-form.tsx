"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@repo/types";
import { signUpSchema } from "@repo/validation";
import { Loader } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useSignUp } from "../hooks/use-sign-up";
import { OAuthProviders } from "./oauth-providers";

export const SignUpForm = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { mutate: signUp, isPending, isError, isSuccess } = useSignUp();
    const router = useRouter();

    const { handleSubmit, control, formState } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        mode: "onSubmit",
    });

    React.useEffect(() => {
        return setIsLoading(isPending || isSuccess);
    }, [isPending, isSuccess, setIsLoading, isError]);

    React.useEffect(() => {
        if (isSuccess) {
            router.push("/email-verification");
        }
    }, [isSuccess, router]);

    const onSubmit = (formData: SignUpSchema) => {
        signUp(formData);
    };

    return (
        <Card className="w-full max-w-sm">
            {isLoading ? (
                <div className="bg-background/50 absolute inset-0 z-10 rounded-md" />
            ) : null}
            <CardHeader className="gap-0">
                <CardTitle className="font-mono text-2xl">Get started</CardTitle>
                <CardDescription>
                    Please fill in the credentials below to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <OAuthProviders />
                <Separator className="my-6" />
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                    <FieldSet>
                        <div className="grid grid-cols-2 gap-3">
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2">
                                        <FieldLabel htmlFor="firstName" className="w-max!">
                                            First name
                                        </FieldLabel>
                                        <Input
                                            id="firstName"
                                            autoComplete="given-name"
                                            required
                                            placeholder="John"
                                            aria-required="true"
                                            {...field}
                                        />
                                        {fieldState.invalid ? (
                                            <FieldError errors={[fieldState.error]} />
                                        ) : null}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2">
                                        <FieldLabel htmlFor="last-name" className="w-max!">
                                            Last name
                                        </FieldLabel>
                                        <Input
                                            id="last-name"
                                            autoComplete="family-name"
                                            placeholder="Doe"
                                            aria-required="false"
                                            {...field}
                                        />
                                        {fieldState.invalid ? (
                                            <FieldError errors={[fieldState.error]} />
                                        ) : null}
                                    </Field>
                                )}
                            />
                        </div>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="email" className="w-max!">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        type="email"
                                        id="email"
                                        autoComplete="email"
                                        required
                                        placeholder="johndoe@example.com"
                                        aria-required="true"
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
                                    <FieldLabel htmlFor="password" className="w-max!">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        autoComplete="new-password"
                                        id="password"
                                        type="password"
                                        required
                                        aria-required="true"
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
                                Already have an account?
                                <Link
                                    href="/sign-in"
                                    className="text-primary font-medium hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </FieldSet>
                </form>
            </CardContent>
        </Card>
    );
};
