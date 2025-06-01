"use client";

import { Button } from "@/components/ui/button";
import { RoundSpinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <RoundSpinner size={"sm"} />}
      {pending ? t("sending-email") : t("login")}
    </Button>
  );
}
