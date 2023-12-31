import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import Dispo from "../models/Dispo";
import User from "../models/User";
import Event from "../models/Event";
import { postEvent, getEvents, deleteEvent } from "../services/eventService";
import { startOfWeek, format } from "date-fns";
import {
    create,
    getByWeek,
    getByUserAndWeek,
    editByUserAndWeek,
} from "../services/dispoService";
import {
    Box,
    Button,
    Card,
    CardContent,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import CircularProgressCustom from "../components/CircularProgressCustom";

function CalendarPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [events2, setEvents2] = useState<any[]>([]);
    const [specialEvents, setSpecialEvents] = useState<Event[]>([]);
    const [dispos, setDispos] = useState<Dispo[]>();
    const [user, setUser] = useState<User>({} as User);
    const [week, setWeek] = useState<Date>(new Date());
    const [dispoChecked, setDispoChecked] = useState<boolean>(true);
    const [editDispo, seteditDispo] = useState<boolean>(false);
    const [personalDispo, setPersonalDispo] = useState<Dispo>();
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open2, setOpen2] = useState(false);
    const handleClose2 = () => setOpen2(false);
    const [title, setTitle] = useState("");
    const [start, setStart] = useState<Date>();
    const [end, setEnd] = useState<Date>();
    const [id, setId] = useState<string>("");

    const handleOpen2 = (title: string, start: string, end: string, id: string) => {
        setTitle(title);
        let startDate = new Date(start);
        let endDate = new Date(end);
        setStart(startDate);
        setEnd(endDate);
        setId(id);
        setOpen2(true);
    };

    const formatDate = (date: Date) => {
        if (!date) {
            return "";
        }
        //format date to string
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let dayString = day < 10 ? "0" + day : day;
        let monthString = month < 10 ? "0" + month : month;
        let hourString = hour < 10 ? "0" + hour : hour;
        let minutesString = minutes < 10 ? "0" + minutes : minutes;
        return (
            dayString +
            "/" +
            monthString +
            "/" +
            year +
            " " +
            hourString +
            ":" +
            minutesString
        );
    };

    //return boolean if title start by Joueur dispo
    const isDispo = (title: string) => {
        return title.startsWith("Joueur dispo");
    };

    const deleteSpecialEvent = async (title: string) => {
        await deleteEvent(title);
        handleClose2();
        window.location.reload();
    };

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

    const handleSpecialEventClick = async (e: React.FormEvent) => {
        e.preventDefault();
        let event = {
            title: (e.target as any).title.value,
            start: (e.target as any).start.value,
            end: (e.target as any).end.value,
            description: (e.target as any).description.value,
        };
        await postEvent(event);
        handleClose();
        window.location.reload();
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await getEvents();
                setSpecialEvents(response); // Fetch and set special events
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvent();
    }, []);

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
        fetchPersonalDispo()
    }, [week, user._id]);

    const responsiveStyles = {
        container: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "90vw",
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

    useEffect(() => {
        if (dispos) {
            createEventIfAvailable(dispos, setEvents, specialEvents).then(() => {
                setLoading(false);
            });
        }
    }, [dispos, specialEvents]);

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
                        <Box
                            sx={{
                                mb: 2,
                                display: "flex",
                                flexDirection: "column",
                                height: "89vh",
                                overflow: "hidden",
                                overflowY: "scroll",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    alignContent: "center",
                                    marginBottom: "20px",
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    align="center"
                                    gutterBottom
                                    sx={{ color: "white" }}
                                >
                                    Entrainements
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <button onClick={() => handleOpen()}>
                                        {" "}
                                        Créer un évènement{" "}
                                    </button>
                                    <button
                                        style={{ marginLeft: "40px" }}
                                        onClick={() => handleEditDispo()}
                                    >
                                        {" "}
                                        Modifier mes disponibilités{" "}
                                    </button>
                                </Box>
                            </div>
                            <div style={{ backgroundColor: "white" }}>
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView="timeGridWeek"
                                    locales={[frLocale]}
                                    locale="fr"
                                    height={!editDispo ? "82vh" : "65vh"}
                                    slotMinTime="12:00"
                                    allDaySlot={false}
                                    headerToolbar={false}
                                    events={events}
                                    //on click on event => open modal with event details
                                    eventClick={(arg) => {
                                        handleOpen2(
                                            arg.event.title,
                                            arg.event.startStr,
                                            arg.event.endStr,
                                            arg.event.id
                                        );
                                    }
                                    }
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
                                            slotMinTime="12:00"
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
                                        {editDispo ? (
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
                                        )}
                                        {editDispo ? (
                                            <button
                                                style={{ marginLeft: "40px" }}
                                                onClick={() => {
                                                    handleSaveDispo();
                                                }}
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
                                                    localStorage.setItem(
                                                        "dispo",
                                                        JSON.stringify(newDispo)
                                                    );
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
                        </Box>
                    )}
                </CardContent>
            </Card>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "#ffffff",
                        boxShadow: 24,
                        borderRadius: "20px",
                        p: 4,
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: "#202124" }}
                        gutterBottom
                    >
                        Créer un évènement
                    </Typography>
                    <form onSubmit={handleSpecialEventClick}>
                        <TextField
                            id="title"
                            label="Titre"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            id="start"
                            label="Début"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="end"
                            label="Fin"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                        />
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                type="button"
                                variant="contained"
                                color="secondary"
                                onClick={handleClose}
                                sx={{ marginRight: "20px" }}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Créer
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
            {/* //modal event details */}
            <Modal open={open2} onClose={handleClose2}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "#ffffff",
                        boxShadow: 24,
                        borderRadius: "20px",
                        p: 4,
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: "#202124" }}
                        gutterBottom
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{ color: "#202124" }}
                        gutterBottom
                    >
                        {formatDate(start!)} - {formatDate(end!)}
                    </Typography>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            onClick={handleClose2}
                            sx={{ marginRight: "20px" }}
                        >
                            Fermer
                        </Button>
                        {/* //button for delete event if !isDispo */}
                        {!isDispo(title) ? (
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={
                                    () => deleteSpecialEvent(id)
                                }
                                sx={{ marginRight: "20px" }}
                            >
                                Supprimer
                            </Button>
                        ) : (
                            <div></div>
                        )}
                    </div>

                </Box>
            </Modal>
        </Box>
    );
}
const createEventIfAvailable = async (
    dispos: Dispo[],
    setEvents: React.Dispatch<any>,
    specialEvents: Event[]
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
                    title: `Joueur dispo : ${playerNames.join(", ")}`, // Include names of available players
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

    // Add special events to the calendar
    if (specialEvents) {
        const newEvents: any[] = [];
        specialEvents.forEach((event) => {
            const newEvent = {
                title: `${event.title} / ${event.description}`,
                start: new Date(event.start),
                end: new Date(event.end),
                color: "#9678d3",
                id: event._id,
            };
            newEvents.push(newEvent);
        });

        setEvents((prevEvents: any) => [...prevEvents, ...newEvents]);
    }
};

export default CalendarPage;
