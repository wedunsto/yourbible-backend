import { AccountStatus } from "./account-status.enum"

export type RegisterResponse = {
    username: string,
    accountStatus: AccountStatus
}