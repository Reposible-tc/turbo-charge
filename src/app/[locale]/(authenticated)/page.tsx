import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Fragment } from "react";
import { getCurrentAuthUser } from "@/features/auth/actions/index";
import {
  ArrowUpRight,
  AudioWaveform,
  ChevronRight,
  ListCheck,
  MessageCircleWarning,
  Milestone,
  Rocket,
  Send,
  Telescope,
  Users,
} from "lucide-react";

const badges = [
  {
    id: 1,
    title: "Read our vision",
    description: "Breaking Free from Complexity",
    icon: Rocket,
    link: "https://www.reposible.com/blog-posts/the-reposible-vision-small-team-big-impact",
  },
  {
    id: 2,
    title: "About Turbo Charge",
    description: "The New Standard for Third-Party Integrations.",
    icon: ListCheck,
    link: "https://www.reposible.com/turbo-charge",
  },
  {
    id: 3,
    title: "Explore the roadmap",
    description: "Have a look at what's coming next",
    icon: Telescope,
    link: "https://www.reposible.com/roadmap",
  },
  {
    id: 4,
    title: "Join the community",
    description: "Discuss builds, ask questions and learn",
    icon: Users,
    link: "https://discord.gg/YHk759Aptn",
  },
  {
    id: 5,
    title: "Influence the roadmap",
    description: "Vote and suggest features directly",
    icon: AudioWaveform,
    link: "https://discord.gg/YHk759Aptn",
  },
  {
    id: 6,
    title: "Get priority support",
    description: "Get help from the founders of Reposible",
    icon: MessageCircleWarning,
    link: "https://discord.gg/YHk759Aptn",
  },
];

const supportCards = [
  {
    id: 1,
    icon: Users,
    title: "Join Discord",
    description: "Chat with other devs, find help, and connect",
    link: "https://discord.gg/YHk759Aptn",
  },
  {
    id: 2,
    icon: Milestone,
    title: "See what's next",
    description: "Stay informed about what's coming",
    link: "https://www.reposible.com/roadmap",
  },
  {
    id: 3,
    icon: Send,
    title: "Email Support",
    description: "Send us an email at hello@reposible.com",
    link: "mailto:hello@reposible.com",
  },
];

export default async function HomePage() {
  await getCurrentAuthUser();

  return (
    <Fragment>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex h-full flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="flex w-full max-w-4xl flex-col gap-12">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Start building</p>
            </div>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <a
                    key={badge.id}
                    href={badge.link}
                    className="flex items-center gap-4 group transition-all"
                    target="_blank"
                  >
                    <div className="flex-shrink-0 h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all" />
                    </div>
                    <div>
                      <div className="flex gap-2 items-center">
                        <h3 className="text-foreground font-medium">
                          {badge.title}
                        </h3>
                        <ChevronRight className="-translate-x-2 transform text-foreground font-semibold opacity-0 transition-transform duration-300 group-hover:translate-x-0 group-hover:opacity-100 size-4" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {badge.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="grid gap-0 grid-cols-1 sm:grid-cols-3 mt-16">
            {supportCards.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.id}
                  href={card.link}
                  className="p-4 rounded-lg flex flex-col text-center items-center justify-center group hover:bg-muted transition-all relative"
                  target="_blank"
                >
                  <ArrowUpRight className="-translate-x-2 translate-y-2 transform text-foreground font-semibold opacity-0 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 size-4 absolute top-4 right-4" />
                  <div className="flex justify-center">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <h2 className="text-foreground font-medium mt-2">
                    {card.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2 max-w-2/3 text-center">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
