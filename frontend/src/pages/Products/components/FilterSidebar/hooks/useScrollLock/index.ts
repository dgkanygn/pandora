import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a modal/sidebar is open
 * Automatically unlocks on desktop (>= 1024px)
 */
const useScrollLock = (isLocked: boolean): void => {
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                document.body.style.overflow = 'unset';
            } else if (isLocked) {
                document.body.style.overflow = 'hidden';
            }
        };

        if (isLocked && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        window.addEventListener('resize', handleResize);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('resize', handleResize);
        };
    }, [isLocked]);
};

export default useScrollLock;
