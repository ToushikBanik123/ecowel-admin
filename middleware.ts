// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path

// export async function middleware(request: NextRequest) {
//   const session = await getServerSession(authOptions);
//   const localeCookie = request.cookies.get('NEXT_LOCALE')?.value || 'en'; // Assuming 'NEXT_LOCALE'

//   if (!session && !request.nextUrl.pathname.startsWith(`/${localeCookie}/auth/login`)) {
//     return NextResponse.redirect(new URL(`/${localeCookie}/auth/login`, request.url));
//   }

//   if (session && request.nextUrl.pathname.startsWith(`/${localeCookie}/auth/login`)) {
//     return NextResponse.redirect(new URL(`/${localeCookie}/dashboard`, request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//     matcher: ['/((?!_next/|_next/static|api/).*)'], // Adjust
// };