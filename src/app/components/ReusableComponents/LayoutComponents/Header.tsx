"use client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React from "react";
import { ArrowLeft, Button } from "lucide-react";
import PurpleIcon from "../PurpleIcon";

import LightningIcon from "@/app/icons/LightningIcon";
import CreateWebinarButton from "@/app/components/ReusableComponents/CreateWebinarButton";

type Props = { user: User };

//TODO: Payment subscription, Assistant
const Header = ({ user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      className="w-full px-4 pt-10 sticky top-0 z-10 flex
      justify-between items-center flex-wrap gap-4 bg-background
      "
    >
      {pathname.includes("pipeline") ? (
        <Button
          className="bg-primary/10 border border-border rounded-xl"
          variant={"outline"}
          onClick={() => router.push("/webinar")}
        >
          <ArrowLeft /> Back to webinar
        </Button>
      ) : (
        <div
          className="
        px-4 py-2 flex justify-center text-bold items-center rounded-xl ng-background
        border border-border text-primary capitalize
        "
        >
          {pathname.split("/")[1]}
        </div>
      )}

      {/* TODO: Build stripe subscription  and create webinar button*/}
      <div className="flex gap-6 items-center flex-wrap">
        <PurpleIcon>
          <LightningIcon />
        </PurpleIcon>

        {/* TODO: Add stripe subscription and create webinar button */}
        {/* user subscription */}

        <CreateWebinarButton />
      </div>
    </div>
  );
};

export default Header;
