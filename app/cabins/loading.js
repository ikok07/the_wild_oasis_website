import Spinner from "@/app/_components/Spinner";

export default function Loading() {
    return <div className="grid items-center justify-center">
        <Spinner />
        <p className="tex-xl text-primary-200">Loading cabin data...</p>
    </div>
}