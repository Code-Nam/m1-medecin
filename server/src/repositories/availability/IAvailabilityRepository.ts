export interface IAvailabilityRepository {
    findDoctorById(id: string): Promise<any>;
    findAvailabilitySlotByUnique(
        doctorId: string,
        date: Date,
        startTime: string
    ): Promise<any>;
    createAvailabilitySlots(slots: any[]): Promise<any>;
    findAvailabilitySlotsForDoctorInRange(
        doctorId: string,
        dateStart: Date,
        dateEnd: Date
    ): Promise<any[]>;
    updateAvailabilitySlot(id: string, data: any): Promise<any>;
    deletePastAvailabilitySlots(before: Date): Promise<any>;
    findDoctorsSample(): Promise<any[]>;
}
