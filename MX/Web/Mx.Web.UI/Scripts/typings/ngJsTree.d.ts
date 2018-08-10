// this file is just a stub, expand as required

declare module ngJsTree {
    export interface NodeState {
        opened?: boolean;
        selected?: boolean;
        disabled?: boolean;
    }

    export interface Node {
        id: string;
        parent: string;
        text: string;
        state?: NodeState;
        data?: any;
    }

    export interface CoreConfiguration {
        themes: any;
        strings: any;
    }

    export interface CheckboxPluginConfiguration {
        keep_selected_style: boolean;
    }

    export interface Configuration {
        core: CoreConfiguration;
        plugins: string[];
        checkbox: CheckboxPluginConfiguration;
    }
} 