import { useEffect } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function TitleWrapper({ title, children }: Props) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <>{children}</>;
}
