declare module Core.NG {

    export interface IStateNode {
        name: string;
        templateUrl: string;
        controller: INamedController;
        url: string;
        views: {};
        params?: string[];
        isAbstract: boolean;
        children?: IStateNode[];
        parent?: IStateNode;

        AddChild(...children: IStateNode[]): IStateNode;
        AddView(name: string, templateUrl: string, controller: INamedController): IStateNode;
        ToUiRouterStates(baseUrl: string, parent?: ng.ui.IState): ng.ui.IState[];
        SetTopLevelUrl(baseUrl: string);
    }
}