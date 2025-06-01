import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApplicationIcon from "@/components/ui/application-icon";
import { APPLICATION_NAME } from "@/utils/constants";
import { getCurrentAuthUser } from "@/features/auth/actions";
import { Link } from "@/i18n/navigation";

export default async function PaymentSuccessPage() {
  await getCurrentAuthUser();

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
            <CardTitle className="text-xl">Payment Successful 🎉</CardTitle>
            <CardDescription>Thank you for your purchase.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid gap-6">
              <p className="text-sm mb-4 text-muted-foreground">
                We&apos;ve received your payment. A confirmation email with your
                receipt and order details has been sent to you.
              </p>
              <div className="flex flex-col gap-4">
                <Button asChild variant={"outline"}>
                  <Link href={"/"}>Go back to home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
