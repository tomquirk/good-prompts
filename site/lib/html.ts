/** React's `dangerouslySetInnerHTML` value. Only pass markup that is trusted or escaped. */
export function rawHtml(html: string) {
  // biome-ignore lint/style/useNamingConvention: React requires this property name
  return { __html: html };
}
