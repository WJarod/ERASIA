import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import CircularProgressCustom from "../components/CircularProgressCustom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import Event from "../models/Event";

const EventCalandar = () => {
    const [specialEvents, setSpecialEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        const events = await getEvents();
        return events;
    }

    useEffect(() => {
        const fetchEvent = async () => {
            const events = await fetchEvents();
            setSpecialEvents(events);
            if (events.length > 0) {
                localStorage.setItem("events", JSON.stringify(events));
            }
        }

        const localEvents = localStorage.getItem("events");
        if (localEvents) {
            setSpecialEvents(JSON.parse(localEvents));
        } else {
            fetchEvent();
        }
    }, []);

    return (
        <>
            {specialEvents.length > 0 ? (
                <div style={{ backgroundColor: "#202124", color: "#582C82", width: "100%" }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        locales={[frLocale]}
                        locale="fr"
                        height={"45vh"}
                        slotMinTime="12:00"
                        allDaySlot={false}
                        headerToolbar={false}
                        events={specialEvents.map((event) => {
                            return {
                                title: event.title,
                                start: event.start,
                                end: event.end,
                                backgroundColor: "#582C82",
                                textColor: "#FFFFFF",
                            }
                        })}
                    />
                </div>
            ) : (
                <CircularProgressCustom />
            )}
        </>
    )
}

export default EventCalandar;
