import { AccountStatus } from "./account-status.enum"

export type LoginResponse = {
    username: string,
    userId: string,
    accessToken: string,
    tokenType: "Bearer",
    onboarded: boolean
}