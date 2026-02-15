import { colors } from "./colors";
import { fonts } from "./fonts";

const main = {
  backgroundColor: colors.mainBg,
  padding: "20px 0",
};

const container = {
  padding: "30px",
  margin: "0 auto",
  maxWidth: "700px",
  backgroundColor: colors.mainForeground,
  borderRadius: "8px",
};

const h1 = {
  color: "#1f2937",
  fontFamily: fonts.basic,
  fontSize: "24px",
  fontWeight: "bold" as const,
  marginBottom: "40px",
  padding: "0",
};

const linkStyle = {
  color: colors.secondary,
  fontFamily: fonts.basic,
  fontSize: "14px",
  textDecoration: "underline",
};

const button = {
  backgroundColor: colors.secondary,
  border: "none",
  padding: "10px 20px",
  color: colors.whiteText,
  cursor: "pointer",
  borderRadius: "5px",
  fontWeight: "500",
  textDecoration: "none",
  fontSize: "16px",
  fontFamily: fonts.basic,
};

const text = {
  color: colors.text,
  fontFamily: fonts.basic,
  fontSize: "14px",
  margin: "24px 0",
  lineHeight: "1.5",
};

const textLight = {
  ...text,
  color: colors.lightText,
};

const footer = {
  color: colors.lightText,
  fontFamily: fonts.basic,
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: colors.codeBg,
  borderRadius: "5px",
  border: "1px solid #eee",
  color: colors.codeText,
};

const headerTable = {
  width: "100%",
  marginBottom: "32px",
};

const logo = {
  verticalAlign: "middle" as const,
};

const brandText = {
  fontFamily: fonts.basic,
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#0f172a",
  margin: "0",
  padding: "0 0 0 8px",
  verticalAlign: "middle" as const,
  display: "inline-block" as const,
};

const sectionCard = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const sectionHeading = {
  fontFamily: fonts.basic,
  color: colors.secondary,
  fontSize: "18px",
  fontWeight: "700" as const,
  margin: "0 0 16px 0",
  padding: "0",
};

const notificationCard = {
  backgroundColor: colors.mainForeground,
  padding: "16px",
  borderRadius: "6px",
  borderLeft: `3px solid ${colors.secondary}`,
  marginBottom: "12px",
};

const notificationTitle = {
  fontFamily: fonts.basic,
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: "600" as const,
  margin: "0 0 8px 0",
  padding: "0",
};

const notificationDescription = {
  fontFamily: fonts.basic,
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 8px 0",
  padding: "0",
};

const notificationLink = {
  fontFamily: fonts.basic,
  color: colors.secondary,
  fontSize: "14px",
  fontWeight: "500" as const,
  textDecoration: "none" as const,
  display: "block" as const,
  marginBottom: "8px",
};

const notificationDate = {
  fontFamily: fonts.basic,
  color: "#94a3b8",
  fontSize: "12px",
  margin: "0",
  padding: "0",
};

const buttonTable = {
  width: "100%",
  margin: "32px 0",
};

const buttonCell = {
  textAlign: "center" as const,
};

const dividerTable = {
  width: "100%",
  margin: "32px 0 24px 0",
};

const divider = {
  borderTop: "1px solid #e2e8f0",
  fontSize: "1px",
  lineHeight: "1px",
  height: "1px",
};

const descriptionText = {
  fontFamily: fonts.basic,
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
  padding: "0",
};

export {
  main,
  container,
  h1,
  linkStyle,
  button,
  text,
  footer,
  code,
  textLight,
  headerTable,
  logo,
  brandText,
  sectionCard,
  sectionHeading,
  notificationCard,
  notificationTitle,
  notificationDescription,
  notificationLink,
  notificationDate,
  buttonTable,
  buttonCell,
  dividerTable,
  divider,
  descriptionText,
};
