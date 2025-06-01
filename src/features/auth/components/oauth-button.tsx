"use client";
import { Button } from "@/components/ui/button";
import React, { Fragment } from "react";
import Image from "next/image";
import { Provider } from "@supabase/supabase-js";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { loginWithOAuth } from "@/features/auth/actions";
import { useTranslations } from "next-intl";

export type OAuthButtonProps = {
  provider: Provider;
  image: {
    light: {
      src: string | StaticImport;
    };
    dark: {
      src: string | StaticImport;
    };
    alt: string;
  };
  text: string;
};

export default function OAuthButton({
  provider,
  image: { light, dark, alt },
  text,
}: OAuthButtonProps) {
  const t = useTranslations();
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => loginWithOAuth(provider)}
    >
      <Fragment>
        <Image
          src={light.src}
          alt={alt}
          width={0}
          height={0}
          className="mr-2 size-5 block dark:hidden"
        />
        <Image
          src={dark.src}
          alt={alt}
          width={0}
          height={0}
          className="mr-2 size-5 hidden dark:block"
        />
      </Fragment>
      {t(text)}
    </Button>
  );
}
