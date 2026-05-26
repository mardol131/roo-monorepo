import React from "react";
import ContentWrapper from "./content-wrapper";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return <ContentWrapper> {children}</ContentWrapper>;
}
