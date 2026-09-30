import { NextResponse, type NextRequest } from "next/server";

// Com output: 'export' (static export para S3+CloudFront), este arquivo não roda.
// Guards de autenticação foram migrados para componentes client-side.
export const proxy = (_request: NextRequest): NextResponse =>
  NextResponse.next();

export const config = { matcher: [] };
