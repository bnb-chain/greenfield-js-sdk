import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // fetch('http://localhost:3000/api/user');

  // const r = await axios.get('http://localhost:26750/account');
  // console.log(r);

  res.status(200).json({ name: 'John Doe' });
}
