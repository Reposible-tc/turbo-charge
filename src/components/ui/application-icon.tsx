import React, { Fragment } from "react";
import Image from "next/image";
import ReposibleIconDark from "@/../public/reposible/reposible-icon-dark.svg";
import ReposibleIconLight from "@/../public/reposible/reposible-icon-light.svg";
import { APPLICATION_NAME } from "@/utils/constants";

export default function ApplicationIcon() {
  return (
    <Fragment>
      <Image
        src={ReposibleIconLight}
        alt={`${APPLICATION_NAME} Logo`}
        className="w-full h-full hidden dark:block"
        width={0}
        height={0}
      />
      <Image
        src={ReposibleIconDark}
        alt={`${APPLICATION_NAME} Logo`}
        className="w-full h-full block dark:hidden"
        width={0}
        height={0}
      />
    </Fragment>
  );
}
