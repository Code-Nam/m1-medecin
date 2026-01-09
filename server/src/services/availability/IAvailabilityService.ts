export interface IAvailabilityService {
    generateSlotsForDoctor(
        doctorId: string,
        startDate: Date,
        endDate: Date
    ): Promise<number>;
    getAvailableSlots(doctorId: string, date: Date): Promise<any[]>;
    bookSlot(slotId: string): Promise<void>;
    releaseSlot(slotId: string): Promise<void>;
    cleanupPastSlots(): Promise<number>;
}
