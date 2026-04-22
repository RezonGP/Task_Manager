import { useState, useEffect } from 'react';

//T : Này, hàm này có thể nhận vào bất kỳ kiểu dữ liệu nào, tạm gọi kiểu đó là T nhé
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}
