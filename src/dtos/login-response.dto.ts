import { AccountStatus } from "./account-status.enum"

export type LoginResponse = {
    username: string,
    accountStatus: AccountStatus
}