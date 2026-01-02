import { prisma } from "@repo/database";
import { hash, verify } from "argon2";

import { APIError } from "@/helpers/api-error";

export const meService = {
    changePassword: async ({
        sessionId,
        userId,
        currentPassword,
        newPassword,
        signOutOfOtherDevices,
    }: {
        sessionId: string;
        userId: string;
        currentPassword: string;
        newPassword: string;
        signOutOfOtherDevices: boolean;
    }) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });

        if (!user) {
            throw new APIError(404, {
                code: "resource_not_found",
                message: "User not found",
            });
        }

        if ((await verify(user.passwordHash, currentPassword)) === false) {
            throw new APIError(400, {
                code: "invalid_password",
                message: "Provided current password is incorrect.",
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { passwordHash: await hash(newPassword) },
                select: { updatedAt: true },
            });

            if (signOutOfOtherDevices) {
                await tx.session.deleteMany({
                    where: {
                        userId,
                        id: {
                            not: { equals: sessionId },
                        },
                    },
                });
            }
        });
    },
};
