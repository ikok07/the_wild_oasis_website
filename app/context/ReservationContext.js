"use client"

import {createContext, useContext, useState} from "react";

const ReservationContext = createContext();

const initialRange = {from:undefined, to:undefined}

export default function ReservationProvider({children}) {
    const [range, setRange] = useState(initialRange)
    const resetRange = () => setRange(initialRange)

    return <ReservationContext.Provider value={{range, setRange, resetRange}}>
        {children}
    </ReservationContext.Provider>
}

export function useReservation() {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error("useReservation must be used inside ReservationProvider");
    }
    return context;
}