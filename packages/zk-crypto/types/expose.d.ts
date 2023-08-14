export function getEddsaCompressedPublicKey(seedString: string): Promise<string>;

export function eddsaSign(seedString: string, message: string): Promise<string>;
