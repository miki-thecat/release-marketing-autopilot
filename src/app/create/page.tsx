import type { Metadata } from "next";
import { ReleaseFlowApp } from "@/components/release-flow-app";

export const metadata: Metadata = {
  title: "Create a Release Pack · ReleaseFlow",
  description: "Turn a browser recording and feature details into a release video and launch-ready social copy.",
};

export default function CreatePage() {
  return <ReleaseFlowApp />;
}
