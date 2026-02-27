import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    openGraph: {
      type: "website",
      locale: "id_ID",
      title: override.title ?? undefined,
      description: override.description ?? undefined,

      url: process.env.NEXT_PUBLIC_APP_URL,
      siteName:`${process.env.NEXT_PUBLIC_APP_NAME}`,
      images: [
        {
          url: process.env.NEXT_PUBLIC_APP_URL + "/og.jpg",
          width: 1200,
          height: 630,
          alt:`${process.env.NEXT_PUBLIC_APP_NAME}`,
        },
      ],
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@ajoroby",
      site: "@laundrypro_id",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: [
        {
          url: process.env.NEXT_PUBLIC_APP_URL + "/og.jpg",
          alt:`${process.env.NEXT_PUBLIC_APP_NAME}`,
        },
      ],
      ...override.twitter,
    },
    verification: {
      google: "Ybw1hEXy-qBtAMeMnxUNW9gvXr3yA_s46QYE5MSHMew",
    },
    other: {
      "msapplication-TileColor": "#ffffff",
      "msapplication-TileImage": "/mstile-144x144.png",
      "msapplication-config": "/browserconfig.xml",
      "theme-color": "#ffffff",
      "application-name":`${process.env.NEXT_PUBLIC_APP_NAME}`,
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title":`${process.env.NEXT_PUBLIC_APP_NAME}`,
      "mobile-web-app-capable": "yes",
    },
  };
}
