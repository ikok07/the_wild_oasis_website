"use server";

import {auth, signIn, signOut} from "@/app/_lib/auth";
import {supabase} from "@/app/_lib/supabase";
import {revalidatePath} from "next/cache";
import {getBookings} from "@/app/_lib/data-service";
import {NextResponse} from "next/server";
import {redirect, RedirectType} from "next/navigation";

export async function updateGuest(formData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in!")

    const nationalID = formData.get("nationalID");
    const [nationality, countryFlag] = formData.get("nationality").split("%");

    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) throw new Error("Please provide a valid national ID!");

    const updateData = {nationality, countryFlag, nationalID}

    const { data, error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', session.user.guestId)
        .select()
        .single();

    if (error) throw new Error('Guest could not be updated');

    revalidatePath("/account/profile")
}

export async function createReservation(bookingData, formData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in!")

    //TODO: Validate if selected dates do not overlap with already booked dates

    const newBooking = {
        ...bookingData,
        guestId: session.user.guestId,
        numGuests: +formData.get("numGuests"),
        observations: formData.get("observations").slice(0, 1000),
        extrasPrice: 0,
        totalPrice: bookingData.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: "unconfirmed",
    }

    const { error } = await supabase
        .from('bookings')
        .insert([newBooking])
        // So that the newly created object gets returned!
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not be created');
    }

    revalidatePath(`/cabins/${bookingData.cabinId}`)

    redirect("/cabins/thankyou");
}

export async function editReservation(formData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in!")

    const bookingId = +formData.get("bookingId")

    const userBookings = await getBookings(session.user.guestId);

    if (!userBookings.some(booking => booking.id === bookingId)) throw new Error("You are not allowed to edit this booking!");

    const updateDate = {
        numGuests: +formData.get("numGuests"),
        observations: formData.get("observations")
    }

    const { data, error } = await supabase
        .from('bookings')
        .update(updateDate)
        .eq('id', bookingId)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not be updated');
    }

    revalidatePath(`/account/reservations/edit/${bookingId}`);
    revalidatePath("/account/reservations");

    redirect("/account/reservations", RedirectType.replace)
}

export async function deleteReservation(bookingId) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in!");

    const userBookings = await getBookings(session.user.guestId);

    if (!userBookings.some(booking => booking.id === bookingId)) throw new Error("You are not allowed to delete this booking!");

    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);

    if (error) {
        console.error(error);
        throw new Error('Booking could not be deleted');
    }

    revalidatePath("/account/reservations");
}

export async function signInAction() {
    await signIn("google", {redirectTo: "/account"});
}

export async function signOutAction() {
    await signOut({redirectTo: "/"});
}