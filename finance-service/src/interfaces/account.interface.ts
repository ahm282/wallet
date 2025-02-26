import { IRepository } from "@/interfaces/generic.interface";
import { Account } from "@/schemas/account.schema";

export interface IAccountRepository extends IRepository<Account> {}
