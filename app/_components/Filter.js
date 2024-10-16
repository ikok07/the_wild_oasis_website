"use client"

import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function Filter() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams()

    function handleFilter(filter) {
        const params = new URLSearchParams(searchParams)
        params.set("capacity", filter);
        router.replace(`${pathname}?${params.toString()}`, {scroll: false})
    }

    return <div className="border border-primary-800 flex">
        <Button
            filter="all"
            handleFilter={handleFilter}
            activeFilter={!searchParams.get("capacity") || searchParams.get("capacity") === "all"}
        >
            All cabins
        </Button>
        <Button
            filter="small"
            handleFilter={handleFilter}
            activeFilter={searchParams.get("capacity") === "small"}
        >
            1&mdash;3 guests
        </Button>
        <Button
            filter="medium"
            handleFilter={handleFilter}
            activeFilter={searchParams.get("capacity") === "medium"}
        >
            4&mdash;7 guests
        </Button>
        <Button
            filter="large"
            handleFilter={handleFilter}
            activeFilter={searchParams.get("capacity") === "large"}
        >
            8&mdash;12 guests
        </Button>
    </div>
}

function Button({filter, handleFilter, activeFilter, children}) {
    return <button
        className={`${activeFilter ? "bg-primary-700" : ""} px-5 py-2 hover:bg-primary-700`}
        onClick={() => handleFilter(filter)}>
        {children}
    </button>
}