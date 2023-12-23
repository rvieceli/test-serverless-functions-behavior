import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        {props.children}
      </body>
    </html>
  );
}
