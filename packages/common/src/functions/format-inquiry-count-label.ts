export const formatInquiryCountLabel = (count: number) => {
  if (count === 1) return "1 poptávka";
  if (count > 1 && count < 5) return `${count} poptávky`;
  return `${count} poptávek`;
};
