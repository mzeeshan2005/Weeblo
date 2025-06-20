import { useEffect, useState } from 'react';
import { ArrowUpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const ScrollTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Button
            variant="ghost"
            onClick={scrollToTop}
            className={cn("z-40 fixed w-fit right-4 bottom-5 mt-10 border bg-primary/50 hover:bg-primary/80 text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 opacity-0 border-none", isVisible && "opacity-100")}
        >
            <ArrowUpCircle />
        </Button>
    );
};

export default ScrollTopButton;
