import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-8 h-16 shrink-0 bg-canvas-dark border-b border-hairline-dark">
      {/* Target only the trigger's text — not the dropdown, which uses default Clerk styles. */}
      <div className="[&_.cl-organizationSwitcherTrigger_.cl-organizationName]:!text-white [&_.cl-organizationSwitcherTrigger_.cl-organizationSwitcherTriggerIcon]:!text-white/60 [&_.cl-organizationSwitcherTrigger_span]:!text-white">
        <OrganizationSwitcher
          hidePersonal
          afterSelectOrganizationUrl="/"
          appearance={{
            elements: {
              rootBox: "text-sm",
              organizationSwitcherTrigger:
                "text-sm py-1.5 px-2 rounded-md hover:bg-surface-elevated transition-colors",
            },
          }}
        />
      </div>
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          elements: {
            avatarBox: "size-8",
          },
        }}
      />
    </header>
  );
}
