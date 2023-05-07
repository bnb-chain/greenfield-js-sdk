export const typeWrapper = (type: string, msg: object) => {
  return {
    ...msg,
    type,
  };
};
