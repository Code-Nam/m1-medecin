export interface ISecretaryService {
    getSecretary(secretaryId: string): Promise<any>;
    getSecretaries(page?: number, pageSize?: number): Promise<any>;
    createSecretary(data: any): Promise<any>;
    updateSecretary(secretaryId: string, data: any): Promise<any>;
    deleteSecretary(secretaryId: string): Promise<void>;
}
