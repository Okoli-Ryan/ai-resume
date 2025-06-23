import { signinWithGoogle } from "@/app/(auth)/sign-in/actions/auth-action";
import { Button } from "@/components/ui/button";

const Signin = async () => {
	return (
		<form action={signinWithGoogle} className="mx-auto max-w-sm space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">Login</h1>
				{/* <p className="text-gray-500 dark:text-gray-400">
                    Enter your email below to login to your account
                </p> */}
			</div>
			<div className="space-y-4">
				{/* <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </div> */}
				{/* <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                    Login
                </Button> */}
				<Button variant="outline" className="w-full">
					Login with Google
				</Button>
			</div>
		</form>
	);
};

export default Signin;
