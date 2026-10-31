import { Header, Footer } from "./Header";
export function SiteShell({ children }: { children: React.ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }
