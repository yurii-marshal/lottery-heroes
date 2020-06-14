/**
 * Internet Explorer 6-11
 * @returns {boolean}
 */
export const isIE611 = (): boolean => {
  return /*@cc_on!@*/false || !!(document as any).documentMode;
};
