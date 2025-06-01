"use client";

import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ExternalLink, Github, Users, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Integration = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

type Template = {
  title: string;
  description: string;
  category: string;
  version: string;
  integrations: Integration[];
  githubStars: number;
  users: number;
  timeSaved: string;
};

type TemplateCardProps = {
  template: Template;
};

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="w-full h-fit overflow-hidden border shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
              {template.category}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
              v{template.version}
            </Badge>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {template.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-base font-semibold mb-4">Integrations</h3>
            <div className="flex gap-3">
              {template.integrations.map((integration) => (
                <Link
                  key={integration.name}
                  href={integration.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm hover:text-primary transition-colors group"
                >
                  <div className="p-2.5 flex justify-center items-center rounded-md bg-muted/70 group-hover:bg-primary/10 transition-colors">
                    {integration.icon}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4">Stats</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0d1117] text-white">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    GitHub Stars
                  </div>
                  <div className="text-lg font-semibold">
                    {template.githubStars}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Active Users
                  </div>
                  <div className="text-lg font-semibold">
                    {template.users.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Time Saved
                  </div>
                  <div className="text-lg font-semibold">
                    {template.timeSaved}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t">
        <Button className="gap-2 transition-all duration-200 shadow-sm hover:shadow-md">
          <span>Use Template</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
