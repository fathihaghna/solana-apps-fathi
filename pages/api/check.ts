import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Supaya bisa diakses Dial.to / Blinkboard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      icon: "https://ucarecdn.com/7aa46571-0f73-455b-9d4f-37ca8d9607f2/", // Icon standar Solana
      title: "Solana Apps Fathi",
      description: "Tes koneksi Solana Action",
      label: "Klik Saya",
      links: {
        actions: [
          {
            label: "Kirim SOL",
            href: "/api/action",
          }
        ]
      }
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}