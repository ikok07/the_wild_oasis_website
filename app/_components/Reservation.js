import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import {getBookedDatesByCabinId, getSettings} from "@/app/_lib/data-service";
import {auth} from "@/app/_lib/auth";
import LoginMessage from "@/app/_components/LoginMessage";

export default async function Reservation({cabin}) {
    const session = await auth();
    const [settings, bookedDates] = await Promise.all([
        getSettings(),
        getBookedDatesByCabinId(cabin.id)
    ])

    return <div className="grid grid-cols-[1.5fr_1fr] border border-primary-800 min-h-[400px]">
        <DateSelector settings={settings} bookedDates={bookedDates} cabin={cabin}/>
        {session?.user ? <ReservationForm cabin={cabin} user={session.user} /> : <LoginMessage />}
    </div>
}