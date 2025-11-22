import * as React from "react";

export function useIsTouchDevice() {
    const [isTouchDevice, setIsTouchDevice] = React.useState<boolean | undefined>();

    React.useEffect(() => {
        const mql = window.matchMedia("(pointer: coarse)");
        const handler = (e: MediaQueryListEvent) => {
            setIsTouchDevice(e.matches);
        };
        mql.addEventListener("change", handler);
        setIsTouchDevice(mql.matches);
        return () => mql.removeEventListener("change", handler);
    }, []);

    return !!isTouchDevice;
}
