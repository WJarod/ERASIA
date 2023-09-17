import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import CircularProgressCustom from "../components/CircularProgressCustom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import Event from "../models/Event";
import { Typography } from "@mui/material";

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
        }
        fetchEvent();
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
                <div style={{
                    height:"45vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    }}>
                    <Typography variant="h2" style={{ color: "#582C82" }}>
                    Pas d'évènements à venir
                    </Typography>
                </div>
            )}
        </>
    )
}

export default EventCalandar;
