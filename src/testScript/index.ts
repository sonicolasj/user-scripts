import UserScript from "../lib/userScript";

class TestScript implements UserScript {
    public changelog = { '1.0': 'Version initiale.' };

    main(): void {
        console.log(42);
    }
}

const script = new TestScript();
script.main();
(window as any).testScript = script;
