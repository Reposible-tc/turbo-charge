import React, { Suspense } from "react";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import NavUserSkeleton from "../../components/skeletons/nav-user-skeleton";
import { createClient } from "@/lib/supabase/server";

export default async function NavUserDetails() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata?.avatar_url;
  const email = user?.email;
  const userName = user?.user_metadata?.user_name;

  return (
    <Suspense fallback={<NavUserSkeleton />}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} alt={email} />
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{userName}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </Suspense>
  );
}
