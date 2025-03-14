export declare class Emitter<T extends {
    [key: number]: any;
}> {
    private listeners;
    on<K extends keyof T>(event: K, listener: (arg: T[K]) => Promise<void>, pushBack?: boolean): void;
    emit<K extends keyof T>(event: K, arg: T[K]): Promise<boolean>;
}
