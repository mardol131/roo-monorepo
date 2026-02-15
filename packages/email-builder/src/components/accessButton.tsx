import { Container, Link } from "@react-email/components";
import { button } from "./styles";

export function AccessButton({ href }: { href: string }) {
  return (
    <>
      <Container style={{ margin: "50px 0px 0px 0px" }}>
        <Link href={href} target="_blank" style={{ ...button }}>
          Měsíční souhrn
        </Link>
      </Container>
    </>
  );
}
