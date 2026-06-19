import { PropsWithChildren } from "react";
import ContentWrapper from "./content-wrapper";

export default async function layout({ children }: PropsWithChildren) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
