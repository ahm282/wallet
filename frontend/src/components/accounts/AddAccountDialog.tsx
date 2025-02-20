import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import validateAccountForm from "@/lib/validations/validate_account_form";
import type {
  Account,
  AccountForm,
  AddAccountDialogProps,
} from "@/types/accounts.types";

export const AddAccountDialog: React.FC<AddAccountDialogProps> = ({
  accounts,
  setAccounts,
}) => {
  const [newAccount, setNewAccount] = useState<AccountForm>({
    name: "",
    balance: 0,
    institution: "",
    currency: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    institution: "",
    balance: "",
    currency: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateAccountForm(newAccount as Account);
    if (isValid) {
      // Simulate API behavior by adding a temporary id.
      // In production, we call the API and use the returned account with its id.
      const createdAccount: Account = {
        ...newAccount,
        id: accounts.length + 1,
      };
      setAccounts([...accounts, createdAccount]);
      setNewAccount({ name: "", balance: 0, institution: "", currency: "" });
      clearErrors();
      setIsAddDialogOpen(false);
    } else {
      setErrors(errors);
    }
  };

  function clearErrors() {
    setErrors({ name: "", institution: "", balance: "", currency: "" });
  }

  return (
    <>
      <Button onClick={() => setIsAddDialogOpen(true)}>
        <Plus className="mr-2 size-4" /> Add Account
      </Button>
      <Credenza open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <CredenzaContent className="sm:max-w-[425px]">
          <CredenzaHeader>
            <CredenzaTitle>Add New Account</CredenzaTitle>
            <CredenzaDescription>
              Create a new account to track your finances
            </CredenzaDescription>
          </CredenzaHeader>
          <form onSubmit={handleAddAccount}>
            <div className="w-11/12 grid gap-4 py-4">
              {/* Name Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={newAccount.name}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
              </div>
              {/* Balance Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="balance" className="text-right">
                  Balance
                </Label>
                <div className="col-span-3">
                  <Input
                    id="balance"
                    type="text"
                    value={newAccount.balance.toString()}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        balance: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  {errors.balance && (
                    <p className="text-xs text-red-500">{errors.balance}</p>
                  )}
                </div>
              </div>
              {/* Institution Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="institution" className="text-right">
                  Institution
                </Label>
                <div className="col-span-3">
                  <Input
                    id="institution"
                    value={newAccount.institution}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        institution: e.target.value,
                      })
                    }
                  />
                  {errors.institution && (
                    <p className="text-xs text-red-500">{errors.institution}</p>
                  )}
                </div>
              </div>
              {/* Currency Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <div className="col-span-3">
                  <Input
                    id="currency"
                    value={newAccount.currency}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, currency: e.target.value })
                    }
                  />
                  {errors.currency && (
                    <p className="text-xs text-red-500">{errors.currency}</p>
                  )}
                </div>
              </div>
            </div>
            <CredenzaFooter className="w-11/12 mx-auto">
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" /> Add Account
              </Button>
              <CredenzaClose asChild>
                <Button variant="outline" onClick={() => clearErrors()}>
                  Cancel
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </CredenzaContent>
      </Credenza>
    </>
  );
};

export default AddAccountDialog;
