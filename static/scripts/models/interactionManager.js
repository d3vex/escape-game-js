class InteractionManager {
    constructor() {
        this.interactionHandlers = {
            'PrintConsole': this.printConsole,
        };
    }

    triggerInteraction(interaction) {
        const handler = this.interactionHandlers[interaction];

        if (handler) {
            handler();
        } else {
            console.log(`Interaction non gérée: ${interaction}`);
        }
    }

    printConsole() {
        console.log('Test interaction');
    }
}

export default new InteractionManager();
