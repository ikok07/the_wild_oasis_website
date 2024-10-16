import {auth} from "@/app/_lib/auth";
export const middleware = auth;

// import {NextResponse} from "next/server";
//
// export function middleware(request) {
//     console.log(request);
//
//     return NextResponse.redirect("https://google.com")
// }
//

export const config = {
    matcher: ["/account"]
}