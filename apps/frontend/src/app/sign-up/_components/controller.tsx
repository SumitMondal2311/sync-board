"use client";

import * as React from "react";

import { SignUpForm } from "./form";
import { SignUpVerificationForm } from "./verification-form";

export const SignUpController = () => {
    const [readyForVerification, setReadyForVerification] = React.useState(false);
    const [email, setEmail] = React.useState("");

    return readyForVerification ? (
        <SignUpVerificationForm email={email} setReadyForVerification={setReadyForVerification} />
    ) : (
        <SignUpForm setEmail={setEmail} setReadyForVerification={setReadyForVerification} />
    );
};
