"use client";
import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
export default function MobileFooter() {
  const routes = useRoutes();
  const { isOpen } = useConversation();
  if (isOpen) return null;
  return (
    <div
      className="
        lg:hidden
        fixed
        flex
        justify-between
        w-full
        bottom-0
        z-40
        items-center
        bg-white
        border-t-[1px]
      "
    >
      {routes.map((route) => (
        <MobileItem
          key={route.label}
          href={route.href}
          icon={route.icon}
          onClick={route.onClick}
          active={route.active}
        />
      ))}
    </div>
  );
}
