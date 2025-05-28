// src/hooks/useInView.js
import { useState, useEffect, useRef } from 'react';

function useInView(options = {}) {
    const { threshold = 0.1, root = null, rootMargin = '0px' } = options;
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        // Simpan nilai ref.current ke variabel lokal
        const currentRef = ref.current; // <<< Perbaikan di sini

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            {
                threshold,
                root,
                rootMargin,
            }
        );

        if (currentRef) { // Gunakan currentRef
            observer.observe(currentRef);
        }

        // Cleanup: Hentikan pengamatan saat komponen di-unmount
        return () => {
            if (currentRef) { // Gunakan currentRef di cleanup juga
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, root, rootMargin]); // Dependensi observer

    return [ref, isInView];
}

export default useInView;