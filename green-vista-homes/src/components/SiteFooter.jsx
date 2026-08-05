import { Instagram, Phone } from "lucide-react";
import logo from "@/assets/logo.png"; // ← Add this import

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background/90">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Jelegs Real Estate" 
              className="h-9 w-9 object-contain"
            />
            <span className="text-lg font-bold text-background">Jelegs Real Estate</span>
          </div>
          <p className="mt-4 text-sm max-w-sm text-background/70">
            Building homes that grow with you. 
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-background">Follow </h4>
          <div className="mt-4 flex gap-3">
            <a className="grid h-9 w-9 place-items-center rounded-full bg-background/10 hover:bg-primary transition" href="https://www.instagram.com/jelegslimited?utm_source=qr"><Instagram className="h-4 w-4"/></a>
            <a className="grid h-9 w-9 place-items-center rounded-full bg-background/10 hover:bg-primary transition" href="#"><Phone className="h-4 w-4"/></a>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <p className="mx-auto max-w-7xl px-5 sm:px-8 py-5 text-xs text-background/60">
          © {new Date().getFullYear()} Jelegs Real Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}