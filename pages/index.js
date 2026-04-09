import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { LAMPORTS_PER_SOL, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

export default function Home() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, connected } = useWallet();
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    
    // --- TRIK ANTI-HYDRATION ERROR ---
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    // ---------------------------------

    const getBalance = async () => {
        if (publicKey) {
            const info = await connection.getBalance(publicKey);
            setBalance(info / LAMPORTS_PER_SOL);
        }
    };

    useEffect(() => { getBalance(); }, [publicKey, connection]);

    const handleSend = async () => {
        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );
            const signature = await sendTransaction(transaction, connection);
            alert('Transaksi Terkirim! Sig: ' + signature);
            await connection.confirmTransaction(signature, 'processed');
            getBalance();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    // Jika belum "mounted" (belum di browser), jangan tampilkan apa-apa dulu
    if (!mounted) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <h1>Solana Pay Kw 🚀</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <WalletMultiButton />
            </div>
            
            {connected && (
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '10px', width: '350px' }}>
                    <p>Saldo: <b>{balance} SOL</b></p>
                    <hr style={{ opacity: 0.2, margin: '15px 0' }}/>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input 
                            placeholder="Alamat Tujuan" 
                            style={{ padding: '12px', borderRadius: '8px', border: 'none' }} 
                            onChange={(e) => setRecipient(e.target.value)} 
                        />
                        <input 
                            placeholder="Jumlah (SOL)" 
                            type="number" 
                            style={{ padding: '12px', borderRadius: '8px', border: 'none' }} 
                            onChange={(e) => setAmount(e.target.value)} 
                        />
                        <button 
                            onClick={handleSend} 
                            style={{ padding: '12px', backgroundColor: '#9945FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            KIRIM SEKARANG
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}