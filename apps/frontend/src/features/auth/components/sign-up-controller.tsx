"use client";

import { useState } from "react";
import { SignUpForm } from "./sign-up-form";
import { SignUpVerificationForm } from "./sign-up-verification-form";

export type SignUpState = "sign-up" | "sign-up-verification";

export const SignUpController = () => {
    const [signUpState, setSignUpState] = useState<SignUpState>("sign-up");

    return (
        <div className="relative w-full max-w-sm rounded-md border p-8 shadow-md">
            {signUpState === "sign-up" ? (
                <SignUpForm setSignUpState={setSignUpState} />
            ) : signUpState === "sign-up-verification" ? (
                <SignUpVerificationForm setSignUpState={setSignUpState} />
            ) : null}
        </div>
    );
};
