"use client";

import { useState } from "react";

import { EmailVerificationForm } from "./email-verification-form";
import { SignUpForm } from "./sign-up-form";

export const SignUpController = () => {
    const [readyForVerification, setReadyForVerification] = useState(false);
    const [email, setEmail] = useState("");

    return readyForVerification ? (
        <EmailVerificationForm email={email} setReadyForVerification={setReadyForVerification} />
    ) : (
        <SignUpForm setEmail={setEmail} setReadyForVerification={setReadyForVerification} />
    );
};
