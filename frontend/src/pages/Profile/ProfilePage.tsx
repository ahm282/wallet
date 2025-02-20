import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ExternalLink, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-11/12 md:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center font-primary text-2xl font-bold">
            <User className="size-7 me-3" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-10">
            <Avatar className="size-16">
              <AvatarImage src={user.picture} alt="User Avatar" />
              <AvatarFallback>
                <User className="size-12" />
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-y-6">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="flex flex-col justify-center gap-y-1">
                  <Label htmlFor="firstName" className="text-muted-foreground">
                    First name
                  </Label>
                  <span id="firstName" className="text-primary">
                    {user.given_name}
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-y-1">
                  <Label htmlFor="familyName" className="text-muted-foreground">
                    Family name
                  </Label>
                  <span id="familyName" className="text-primary">
                    {user.family_name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-y-1">
                <Label htmlFor="email" className="text-muted-foreground">
                  Email
                </Label>
                <span id="email" className="text-primary">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="size-5 me-3" />
            Account Activity
          </CardTitle>
          <CardDescription>Recent activity and login history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Last Login</p>
              <p className="text-xs text-muted-foreground">june 10, 2025</p>
            </div>
            <div>
              <p className="text-sm font-medium">Recent Transactions</p>
              <p className="text-xs text-muted-foreground">
                View your latest financial activities
              </p>
              <Link to="/transactions">
                <Button variant="link" className="p-0">
                  Go to Transactions
                  <ExternalLink className="size-36" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        <div>
                            <Label htmlFor='currentPassword'>Current Password</Label>
                            <Input
                                id='currentPassword'
                                type='password'
                            />
                        </div>
                        <div>
                            <Label htmlFor='newPassword'>New Password</Label>
                            <Input
                                id='newPassword'
                                type='password'
                            />
                        </div>
                        <div>
                            <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                            <Input
                                id='confirmPassword'
                                type='password'
                            />
                        </div>
                        <Button>Change Password</Button>
                    </div>
                </CardContent>
            </Card> */}
    </div>
  );
}
