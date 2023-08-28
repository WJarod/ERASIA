export interface AvailabilityTime {
    startTime: string;
    endTime: string;
}

export interface UserAvailability {
    [key: string]: AvailabilityTime;
}