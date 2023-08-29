import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import Dispo from "../models/Dispo";
import User from "../models/User";
import { startOfWeek, format } from "date-fns";
import { create, getByWeek, getByUserAndWeek, editByUserAndWeek } from "../services/dispoService";
import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import CircularProgressCustom from "../components/CircularProgressCustom";

function CalendarPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [events2, setEvents2] = useState<any[]>([]);
    const [dispos, setDispos] = useState<Dispo[]>();
    const [user, setUser] = useState<User>({} as User);
    const [week, setWeek] = useState<Date>(new Date());
    const [dispoChecked, setDispoChecked] = useState<boolean>(true);
    const [editDispo, seteditDispo] = useState<boolean>(false);
    const [personalDispo, setPersonalDispo] = useState<Dispo>();
    const [loading, setLoading] = useState<boolean>(true);

    const handleSelect = (arg: any) => {
        // gen random ID
        const random = Math.floor(Math.random() * 100000000) + 1;
        const newEvent = {
            title: "Disponible (cliquez pour supprimer)",
            start: new Date(arg.startStr), // Convertir en objet Date
            end: new Date(arg.endStr), // Convertir en objet Date
            color: "#582C82",
            id: random,
            user_name: user.username,
        };

        if (
            !events2.some(
                (event) =>
                    event.start.getTime() === newEvent.start.getTime() &&
                    event.end.getTime() === newEvent.end.getTime()
            )
        ) {
            setEvents2((prevEvents) => [...prevEvents, newEvent]);
        }
    };

    const handleEventClick = (arg: any) => {
        arg.event.remove();
        events2.splice(
            events2.findIndex((event) => event.id === arg.event.id),
            1
        );

        setEvents2(events2);
    };

    const setCurrentWeek = async () => {
        const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        setWeek(currentWeek);
    };

    const saveDispo = async (dispo: Dispo) => {
        try {
            await create(dispo);
            setDispoChecked(true);
        } catch (error) {
            console.error("Error creating dispo:", error);
        }
    };

    const handleEditDispo = () => {
        // set personal dispo in events2
        if (personalDispo) {
            const newEvents: any[] = [];
            personalDispo.dispo.forEach((slot) => {
                const newEvent = {
                    title: "Disponible (cliquez pour supprimer)",
                    start: new Date(slot.start), // Convertir en objet Date
                    end: new Date(slot.end), // Convertir en objet Date
                    color: "#582C82",
                    id: slot.id,
                    user_name: slot.user_name,
                };
                newEvents.push(newEvent);
            });
            setEvents2(newEvents);
        }

        seteditDispo(true);
    };

    const handleSaveDispo = async () => {
        const newDispo: Dispo = {
            user: user,
            week: week,
            dispo: events2,
        };
        localStorage.setItem("dispo", JSON.stringify(newDispo));
        setDispoChecked(true);
        await editByUserAndWeek(week, user._id, newDispo);
        seteditDispo(false);
    };

    useEffect(() => {
        setCurrentWeek();
        const localUser = localStorage.getItem("user");
        if (localUser) {
            setUser(JSON.parse(localUser));
        }

        // Initialize events from local storage if available, but only when the component mounts
        const storedEvents = localStorage.getItem("events");
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    }, []);

    useEffect(() => {
        const fetchDispos = async () => {
            try {
                if (!week) {
                    return;
                }
                const response = await getByWeek(week);
                setDispos(response);
            } catch (error) {
                console.error("Error fetching dispo:", error);
            }
        };

        // Fetch dispos when the week or user._id changes
        fetchDispos();

        const fetchPersonalDispo = async () => {
            try {
                if (!user._id) {
                    return;
                }
                setLoading(true);
                const response = await getByUserAndWeek(week, user._id);
                setPersonalDispo(response);
                setDispoChecked(!!response);
            } catch (error) {
                console.error("Error fetching personal dispo:", error);
            }
        };

        // Fetch personal dispos when the week or user._id changes
        fetchPersonalDispo().then(() => setLoading(false));
    }, [week, user._id]);

    useEffect(() => {
        if (dispos) {
            createEventIfAvailable(dispos, setEvents); // Pass setEvents as an argument
        }
    }, [dispos]);

    const responsiveStyles = {
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        },
        card: {
            width: "100%",
            borderRadius: "20px",
            backgroundColor: "#202124",
        },
        cardContent: {
            backgroundColor: "#202124",
        },
    };

    return (
        <Box sx={responsiveStyles.container}>
            <Card style={responsiveStyles.card}>
                <CardContent style={responsiveStyles.cardContent}>
                    {loading ? (
                        <>
                            <Typography variant="h5" align="center" gutterBottom>
                                Entrainements
                            </Typography>
                            <CircularProgressCustom />
                        </>
                    ) : (
                        <>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                alignContent: "center",
                                marginBottom: "20px"
                            }}>
                                <Typography variant="h5" align="center" gutterBottom sx={{ color: "white" }}>
                                    Entrainements
                                </Typography>
                                <button onClick={() => handleEditDispo()}> Modifier mes disponibilités </button>
                            </div>
                            <div style={{ backgroundColor: "white" }}>
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView="timeGridWeek"
                                    locales={[frLocale]}
                                    locale="fr"
                                    height="60vh"
                                    slotMinTime="14:00"
                                    allDaySlot={false}
                                    headerToolbar={false}
                                    events={events}
                                />
                            </div>
                            {!dispoChecked || editDispo ? (
                                <div>
                                    <Typography
                                        variant="h5"
                                        align="center"
                                        gutterBottom
                                        sx={{ marginTop: "10px", color: "white" }}
                                    >
                                        Disponibilités
                                    </Typography>
                                    <div style={{ backgroundColor: "white" }}>
                                        <FullCalendar
                                            plugins={[
                                                dayGridPlugin,
                                                timeGridPlugin,
                                                interactionPlugin,
                                            ]}
                                            initialView="timeGridWeek"
                                            locales={[frLocale]}
                                            locale="fr"
                                            height="65vh"
                                            slotMinTime="14:00"
                                            allDaySlot={false}
                                            headerToolbar={false}
                                            selectable={true}
                                            select={handleSelect}
                                            events={events2}
                                            eventClick={handleEventClick}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            marginTop: "20px",
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {
                                            editDispo ? (
                                                <button
                                                    onClick={() => {
                                                        seteditDispo(false);
                                                    }}
                                                >
                                                    Annuler
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEvents([]);
                                                    }}
                                                >
                                                    Réinitialiser
                                                </button>
                                            )
                                        }
                                        {editDispo ? (
                                            <button
                                                style={{ marginLeft: "40px" }}
                                                onClick={() => {
                                                    handleSaveDispo();
                                                }
                                                }
                                            >
                                                Sauvegarder
                                            </button>
                                        ) : (
                                            <button
                                                style={{ marginLeft: "40px" }}
                                                onClick={() => {
                                                    const newDispo: Dispo = {
                                                        user: user,
                                                        week: week,
                                                        dispo: events2,
                                                    };
                                                    localStorage.setItem("dispo", JSON.stringify(newDispo));
                                                    setDispoChecked(true);
                                                    saveDispo(newDispo);
                                                }}
                                            >
                                                Confirmer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
const createEventIfAvailable = (
    dispos: Dispo[],
    setEvents: React.Dispatch<any>
) => {
    if (dispos) {
        const newEvents: any[] = [];

        // Group time slots by day
        const timeSlotsPerDay: { [key: string]: any[] } = {};
        dispos.forEach((dispo) => {
            dispo.dispo.forEach((slot) => {
                const dateFormatted = format(new Date(slot.start), "yyyy-MM-dd");
                if (timeSlotsPerDay[dateFormatted]) {
                    timeSlotsPerDay[dateFormatted].push(slot);
                } else {
                    timeSlotsPerDay[dateFormatted] = [slot];
                }
            });
        });

        // Create common events for each day
        Object.entries(timeSlotsPerDay).forEach(([dateFormatted, timeSlots]) => {
            const availablePlayers: { [key: string]: boolean } = {};
            const playerNames: string[] = []; // To store names of available players

            timeSlots.forEach((slot) => {
                availablePlayers[slot.id] = true;
                playerNames.push(slot.user_name); // Collect names of available players
            });

            const playerCounts = Object.keys(availablePlayers).length - 1;

            // Modification de la condition ici
            if (timeSlots.length >= playerCounts) {
                // Sort events by start time
                timeSlots.sort((a, b) => a.start.localeCompare(b.start));

                let commonStartTime = timeSlots[0].start;
                let commonEndTime = timeSlots[0].end;

                timeSlots.forEach((slot) => {
                    if (!commonStartTime || slot.start > commonStartTime) {
                        commonStartTime = slot.start;
                    }
                    if (!commonEndTime || slot.end < commonEndTime) {
                        commonEndTime = slot.end;
                    }
                });

                for (let i = 1; i <= timeSlots.length - 5; i++) {
                    let hasCommonSlot = true;

                    for (let j = i; j < i + 5; j++) {
                        if (
                            timeSlots[j].start > commonEndTime ||
                            timeSlots[j].end < commonStartTime
                        ) {
                            hasCommonSlot = false;
                            break;
                        }
                    }

                    if (hasCommonSlot) {
                        commonStartTime = timeSlots[i].start;
                        commonEndTime = timeSlots[i + 4].end;
                    }
                }

                const commonEvent = {
                    title: `Entrainement (${playerNames.join(", ")})`, // Include names of available players
                    start: commonStartTime,
                    end: commonEndTime,
                    color: "#582C82",
                };
                newEvents.push(commonEvent);
            }
        });

        // Set the events in the calendar
        setEvents(newEvents);
    }
};

export default CalendarPage;
