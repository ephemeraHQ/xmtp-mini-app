import { Metadata } from "next";
import dynamic from "next/dynamic";
import { OG_IMAGE_SIZE } from "@/lib/constants";
import { env } from "@/lib/env";

const HomePage = dynamic(() => import("@/components/pages/home"), {
  ssr: false,
});

type NextProps = {
  params: Promise<{ conversationId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Frames frame configuration to be used in the opengraph fc:frame tag
 * @param _searchParams stringified search params
 * @returns frame configuration object
 */
const frame = (_searchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  const buttonTitle = "Join chat";
  const imageUrl = `${env.NEXT_PUBLIC_URL}/api/og`;

  return {
    version: "next",
    imageUrl,
    button: {
      title: buttonTitle,
      action: {
        type: "launch_frame",
        name: buttonTitle,
        url: env.NEXT_PUBLIC_URL,
        splashImageUrl: `${env.NEXT_PUBLIC_URL}/images/splash.png`,
        splashBackgroundColor: "#0d0d0d",
      },
    },
  };
};

/**
 * Default Next.js function to generate metadata for the page
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * @param _searchParams stringified search params
 * @returns metadata object
 */
export async function generateMetadata({
  searchParams,
}: NextProps): Promise<Metadata> {
  const _searchParams = await searchParams;
  const ogTitle = "XMTP MiniApp";
  const ogDescription =
    "Start a conversation with your friends on Farcaster. 💬";
  const ogImageUrl = `${env.NEXT_PUBLIC_URL}/images/frame-default-image.png`;
  console.log("ogImageUrl", ogImageUrl);
  return {
    title: ogTitle,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      creator: "@xmtp_",
      siteId: "1382634722719858690",
      creatorId: "1382634722719858690",
      images: [ogImageUrl],
    },
    other: {
      "fc:frame": JSON.stringify(frame(_searchParams)),
    },
  };
}

export default function Home() {
  return <HomePage />;
}
