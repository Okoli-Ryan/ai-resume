export { auth as middleware} from "@/auth"

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.json).*)"],
};

// import { NextResponse } from "next/server";

// import { auth } from "@/auth";

// export default auth(() => {
// 	// Create response
// 	const response = NextResponse.next();

// 	// Add custom header in non-production environments
// 	if (process.env.NODE_ENV !== "production") {
// 		response.headers.set("x-forwarded-host", "localhost:3000");
// 	}

// 	return response;
// });

// export const config = {
// 	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.json).*)"],
// };
