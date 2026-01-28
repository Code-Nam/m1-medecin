import type {
    CreateSecretaryDTO,
    UpdateSecretaryDTO,
    SecretaryListItem,
    SecretaryDetail,
} from "../../models/secretary";

export interface ISecretaryRepository {
    findSecretaryById(id: string): Promise<SecretaryDetail | null>;
    findSecretaries(
        page?: number,
        pageSize?: number,
    ): Promise<{ secretaries: SecretaryListItem[]; total: number }>;
    createSecretary(data: CreateSecretaryDTO): Promise<SecretaryDetail>;
    updateSecretary(
        id: string,
        data: UpdateSecretaryDTO,
    ): Promise<SecretaryDetail>;
    deleteSecretaryById(id: string): Promise<SecretaryDetail>;
    countSecretaries(): Promise<number>;
    removeDoctorRelationsForSecretary(
        secretaryInternalId: string,
    ): Promise<any>;
}
