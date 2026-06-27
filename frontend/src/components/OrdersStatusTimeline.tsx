const steps = [
  'Menunggu Pembayaran',
  'Pembayaran Diverifikasi',
  'Sedang Diproses',
  'Sedang Dikemas',
  'Sedang Dikirim',
  'Dalam Perjalanan',
  'Pesanan Sampai',
  'Pesanan Selesai'
];

interface Props {
  currentStatus: string;
}

export default function OrdersStatusTimeline({ currentStatus }: Props) {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-brownDark">Status Pesanan</h2>
      <div className="space-y-5">
        {steps.map((step, index) => (
          <div key={step} className="flex items-start gap-4">
            <div className={`mt-1 h-4 w-4 rounded-full ${index <= currentIndex ? 'bg-brownDark' : 'bg-brownLight'}`} />
            <div>
              <p className={`text-sm font-semibold ${index <= currentIndex ? 'text-brownDark' : 'text-brownDark/60'}`}>{step}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
