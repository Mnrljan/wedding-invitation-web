// src/hooks/useInView.js
import { useState, useEffect, useRef } from 'react';

function useInView(options = {}) {
    const { threshold = 0.1, root = null, rootMargin = '0px' } = options;
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null); // Ref untuk elemen yang akan diamati

    useEffect(() => {
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

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold, root, rootMargin]);

    return [ref, isInView]; // Kembalikan ref dan status isInView
}

export default useInView;