import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";
import {getBookedDatesByCabinId, getCabin, getCabins, getSettings} from "@/app/_lib/data-service";
import Image from "next/image";
import TextExpander from "@/app/_components/TextExpander";
import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import Reservation from "@/app/_components/Reservation";
import {Suspense} from "react";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";

export async function generateMetadata({params}) {
    const { name } = await getCabin(params.cabinId);
    return {
        title: `Cabin ${name}`
    }
}

export async function generateStaticParams() {
    const cabins = await getCabins();
    return cabins.map(cabin => ({cabinId: String(cabin.id)}))
}

export const revalidate = 60 * 60; // refreshes every minute

export default async function Page({params}) {
    const cabin = await getCabin(params.cabinId)

    return (
        <div className="max-w-7xl mx-auto mt-8">
            <Cabin cabin={cabin} />

            <div>
                <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
                    Reserve {cabin.name} today. Pay on arrival.
                </h2>
                <Suspense fallback={<Spinner />}>
                    <Reservation cabin={cabin} />
                </Suspense>
            </div>
        </div>
    );
}