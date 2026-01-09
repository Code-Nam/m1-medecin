import type { CreateSecretaryDTO, UpdateSecretaryDTO, SecretaryListItem, SecretaryDetail } from "../../models/secretary";

export interface ISecretaryRepository {
    findSecretaryByExternalId(secretaryId: string): Promise<SecretaryDetail | null>;
    findSecretaryById(id: string): Promise<SecretaryDetail | null>;
    findSecretaries(page?: number, pageSize?: number): Promise<{ secretaries: SecretaryListItem[]; total: number }>;
    createSecretary(data: CreateSecretaryDTO): Promise<SecretaryDetail>;
    updateSecretary(secretaryId: string, data: UpdateSecretaryDTO): Promise<SecretaryDetail>;
    deleteSecretaryByExternalId(secretaryId: string): Promise<SecretaryDetail>;
    findSecretariesByDoctorExternalId(doctorId: string): Promise<SecretaryListItem[] | null>;
    countSecretaries(): Promise<number>;
    findDoctorByExternalId(doctorId: string): Promise<any | null>;
    removeDoctorRelationsForSecretary(secretaryInternalId: string): Promise<any>;
}
