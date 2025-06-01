import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApplicationIcon from "@/components/ui/application-icon";
import { APPLICATION_NAME } from "@/utils/constants";
import { requireNoCurrentUser } from "@/features/auth/actions";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function OTPSuccessPage() {
  await requireNoCurrentUser();
  const t = await getTranslations();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/login"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md text-primary-foreground">
            <ApplicationIcon />
          </div>
          <span className="font-semibold">{APPLICATION_NAME}</span>
        </Link>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
              <Mail className="size-5 text-green-700" />
            </div>
            <CardTitle className="text-xl">{t("check-your-inbox")}</CardTitle>
            <CardDescription>
              {t("we-and-apos-ve-sent-you-a-login-link")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm mb-4 text-muted-foreground">
              {t(
                "please-check-your-inbox-and-click-the-link-to-sign-in-if-you-don-and-apos-t-see-the-email-check-your-spam-folder-or-try-again-in-a-few-minutes"
              )}
            </p>
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link href={"/login"}>{t("go-back-to-login")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
