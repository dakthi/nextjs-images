'use client';

interface DiscountBadgeProps {
  discountPercentage?: number;
  discountText?: string;
  billAmount?: string;
  position?: 'middle-right' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
  scale?: number;
}

export default function DiscountBadge({
  discountPercentage = 10,
  discountText = 'Giảm thêm',
  billAmount = '£150',
  position = 'middle-right',
  size = 'medium',
  scale = 1,
}: DiscountBadgeProps) {
  const sizeClasses = {
    small: 'w-40 h-40',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  };

  const positionClasses = {
    'middle-right': 'top-[20%] right-2 -translate-y-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={`absolute z-50 ${positionClasses[position]}`} style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} text-center text-white font-bold font-[family-name:var(--font-montserrat)] rounded-full`}>
        {/* Outer shadow/outline ring */}
        <div className="absolute inset-0 bg-red-600 rounded-full shadow-2xl ring-4 ring-white ring-offset-2 ring-offset-red-600" style={{filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.4))'}}></div>

        {/* Inner highlight */}
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-red-400 rounded-full blur-xl opacity-50"></div>

        {/* Text content */}
        <div className="relative flex flex-col items-center justify-center px-4 text-sm leading-tight font-[family-name:var(--font-montserrat)]">
          <span className="text-base font-black uppercase tracking-widest">{discountText}</span>
          <span className="text-4xl font-black">{discountPercentage}%</span>
          <span className="text-sm font-black">tổng bill với bill từ</span>
          <span className="text-2xl font-black">{billAmount}</span>
        </div>
      </div>
    </div>
  );
}
