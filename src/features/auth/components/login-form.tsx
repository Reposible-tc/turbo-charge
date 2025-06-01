import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Google from "@/../public/auth-providers/google.svg";
import Discord from "@/../public/auth-providers/discord.svg";
import GithubDark from "@/../public/auth-providers/github-dark.svg";
import GithubLight from "@/../public/auth-providers/github-light.svg";
import { loginWithOTP } from "@/features/auth/actions";
import { APPLICATION_NAME } from "@/utils/constants";
import OAuthButton, { OAuthButtonProps } from "./oauth-button";
import SubmitButton from "./submit-button";
import { getTranslations } from "next-intl/server";
import { cn } from "@/utils/cn";

const providers: OAuthButtonProps[] = [
  {
    provider: "google",
    image: {
      light: { src: Google },
      dark: { src: Google },
      alt: "Google",
    },
    text: "login-with-google",
  },
  {
    provider: "github",
    image: {
      light: { src: GithubDark },
      dark: { src: GithubLight },
      alt: "Github",
    },
    text: "login-with-github",
  },
  {
    provider: "discord",
    image: {
      light: { src: Discord },
      dark: { src: Discord },
      alt: "Discord",
    },
    text: "login-with-discord",
  },
];

export async function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = await getTranslations();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("welcome")}</CardTitle>
          <CardDescription>
            {t("login-with-your-google-github-or-discord-account")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              {providers.map(
                ({ provider, image: { light, dark, alt }, text }) => (
                  <OAuthButton
                    key={provider}
                    provider={provider}
                    image={{ light, dark, alt }}
                    text={text}
                  />
                )
              )}
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-card px-2 text-muted-foreground">
                {t("or-login-with")}
              </span>
            </div>
            <form action={loginWithOTP}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder={`hello@${APPLICATION_NAME.toLowerCase()}.com`}
                    required
                  />
                </div>
                <SubmitButton />
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:decoration-dotted [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        {t("by-clicking-continue-you-agree-to-our")}{" "}
        <a target="_blank" href="https://www.reposible.com/legal/terms-of-use">
          {t("terms-of-use")}
        </a>{" "}
        {t("and")}{" "}
        <a
          target="_blank"
          href="https://www.reposible.com/legal/privacy-policy"
        >
          {t("privacy-policy")}
        </a>
        .
      </div>
    </div>
  );
}
