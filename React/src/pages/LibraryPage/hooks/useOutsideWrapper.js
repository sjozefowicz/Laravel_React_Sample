import { useEffect } from "react";

/**
 * Hook that close ref when clicks outside of it
 */
export function useOutsideWrapper(ref) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                ref.current.classList.remove('publishersListActive');
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}