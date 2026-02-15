import { Img, Link, Text } from "@react-email/components";
import { footer, linkStyle, textLight, dividerTable, divider } from "./styles";

export function Footer() {
  return (
    <>
      {/* Divider */}
      <table style={dividerTable}>
        <tr>
          <td style={divider}></td>
        </tr>
      </table>

      {/* Footer Content */}
      <Text style={textLight}>
        S pozdravem,
        <br />
        Tým OSVČ365
      </Text>

      {/* Logo and Branding */}
      <table style={{ marginBottom: "16px" }}>
        <tr>
          <td>
            <Img
              src={`https://www.osvc365.cz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-osvc.9507aaa6.png&w=128&q=75`}
              width="32"
              height="32"
              alt="OSVČ365 Logo"
              style={{ verticalAlign: "middle" }}
            />
          </td>
          <td style={{ paddingLeft: "8px", verticalAlign: "middle" }}>
            <Link
              href="https://osvc365.cz"
              target="_blank"
              style={{ ...linkStyle, color: "#898989" }}
            >
              OSVČ365
            </Link>
          </td>
        </tr>
      </table>

      {/* Copyright */}
      <Text style={{ ...footer, marginBottom: "4px" }}>
        © {new Date().getFullYear()} OSVČ365. Všechna práva vyhrazena.
      </Text>

      {/* Legal Disclaimer */}
      <Text style={{ ...footer, marginBottom: "0" }}>
        Údaje v tomto emailu nelze považovat za právní či daňové poradenství.
        Pro konkrétní situace doporučujeme konzultaci s odborníkem.
      </Text>
    </>
  );
}
