import Cryptr from 'cryptr';

export function encrypt(text: string): string {
  const secretKey: string = process.env.NEXTAUTH_SECRET as string;
  const cryptr = new Cryptr(secretKey);

  const encryptedString: string = cryptr.encrypt(text);
  return encryptedString;
}

export function decrypt(encryptedString: string): string {
  const secretKey: string = process.env.NEXTAUTH_SECRET as string;
  const cryptr = new Cryptr(secretKey);

  const text: string = cryptr.decrypt(encryptedString);
  return text;
}
