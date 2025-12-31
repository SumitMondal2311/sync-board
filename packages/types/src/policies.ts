// ----- Workspace Policy ----- //

import { WorkspaceMemberRole } from "@repo/database";

export class WorkspacePolicy {
    private strictMode: boolean;
    private userId: string;
    private isAdminOrManager: boolean;
    private isMember: boolean;
    constructor({
        strictMode,
        role,
        userId,
    }: {
        strictMode: boolean;
        role: WorkspaceMemberRole;
        userId: string;
    }) {
        this.strictMode = strictMode;
        this.userId = userId;
        this.isAdminOrManager = role === "ADMIN" || role === "MANAGER";
        this.isMember = role === "MEMBER";
    }

    canInviteMembers = () => this.isAdminOrManager;
    canChangeMembersRole = () => this.isAdminOrManager;
    canRemoveMembers = () => this.isAdminOrManager;

    canCreateBoards = () => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode) return true;
        return false;
    };

    canEditBoards = (creatorId: string) => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode && this.userId === creatorId) return true;
        return false;
    };

    canDeleteBoards = (creatorId: string) => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode && this.userId === creatorId) return true;
        return false;
    };

    canCreateLists = () => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode) return true;
        return false;
    };

    canEditLists = () => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode) return true;
        return false;
    };

    canMoveLists = () => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode) return true;
        return false;
    };

    canDeleteLists = () => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode) return true;
        return false;
    };

    canCreateTasks = () => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode) return true;
        return false;
    };

    canEditTasks = (assigneeId?: string) => {
        if (this.isAdminOrManager) return true;
        if (this.isMember) {
            if (this.strictMode) {
                return assigneeId ? assigneeId === this.userId : false;
            } else {
                return true;
            }
        }

        return false;
    };

    canMoveTasks = (assigneeId?: string) => {
        if (this.isAdminOrManager) return true;
        if (this.isMember) {
            if (this.strictMode) {
                return assigneeId ? assigneeId === this.userId : false;
            } else {
                return true;
            }
        }

        return false;
    };

    canAssignTasks = () => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode) return true;
        return false;
    };

    canDeleteTasks = () => {
        if (this.isAdminOrManager) return true;
        if (this.isMember && !this.strictMode) return true;
        return false;
    };
}
