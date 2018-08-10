export default interface UserScript {
    changelog: { [version: string]: string };
    main(): void;
}
