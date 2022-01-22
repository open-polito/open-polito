declare module "@config" {
    type BuildConfig = {
        variant: string;
    };

    const config: BuildConfig;
    export default config;
}