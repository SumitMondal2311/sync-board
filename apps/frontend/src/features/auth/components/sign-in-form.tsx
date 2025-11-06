"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "@repo/types";
import { authSchema } from "@repo/validation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignInForm() {
    const router = useRouter();

    const { mutate, isPending, isSuccess } = useMutation<
        { token: string },
        AxiosError<ApiError>,
        AuthSchema
    >({
        mutationFn: (data) => apiClient.post("/api/v1/auth/sign-in", data),
        onSuccess: () => router.push("/dashboard"),
        onError: (error) => toast.error(error.response?.data.message || "unknown error"),
    });

    const form = useForm<AuthSchema>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            emailAddress: "",
            password: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = useCallback(
        (data: AuthSchema) => {
            mutate(data);
        },
        [mutate]
    );

    return (
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
            {isSuccess ? (
                <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-white">
                    Authorizing...
                </div>
            ) : null}
            <FieldSet>
                <FieldContent className="gap-0 text-center">
                    <FieldLegend className="font-mono text-2xl!">Sign In</FieldLegend>
                    <FieldDescription>
                        Welocome back! Please fill in the credentials below to continue
                    </FieldDescription>
                </FieldContent>
                <FieldGroup>
                    <Controller
                        name="emailAddress"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="gap-2">
                                <FieldLabel htmlFor="email-address" className="w-max!">
                                    Email Address
                                </FieldLabel>
                                <Input
                                    id="email-address"
                                    type="email"
                                    required
                                    placeholder="Enter your email address"
                                    {...field}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    {...field}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Button disabled={isPending} type="submit" className="cursor-pointer">
                        {isPending ? <Loader2 className="animate-spin" /> : "Continue"}
                    </Button>
                </FieldGroup>
                <div className="space-x-2 self-center text-sm">
                    <span>Don&apos;t have an account?</span>
                    <Link href="/sign-up" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </FieldSet>
        </form>
    );
}
