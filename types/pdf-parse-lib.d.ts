declare module "pdf-parse/lib/pdf-parse.js" {
  function pdfParse(
    data: Buffer,
    options?: Record<string, unknown>
  ): Promise<{ text?: string }>;
  export default pdfParse;
}
