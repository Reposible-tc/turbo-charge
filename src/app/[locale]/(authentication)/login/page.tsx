import { LoginForm } from "@/features/auth/components/login-form";
import ApplicationIcon from "@/components/ui/application-icon";
import { APPLICATION_NAME, WEBSITE_URL } from "@/utils/constants";
import { requireNoCurrentUser } from "@/features/auth/actions";

export default async function LoginPage() {
  await requireNoCurrentUser();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href={WEBSITE_URL}
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md text-primary-foreground">
            <ApplicationIcon />
          </div>
          <span className="font-semibold">{APPLICATION_NAME}</span>
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
