module Administration.Hierarchy.Services {
    "use strict";

    export interface ILocationService {
        LoadData(): void;
        Subscribe(subscribingScope: ng.IScope, handler: (location: ILocation, levels: string[]) => any, context?: any): void;
        GetLocationById(id: number): ng.IPromise<ILocation>;
        SortLocationChildren(location: ILocation): void;
        CreateNewLocationForParent(parentLocationId: number, locationName: string, locationNumber: string): ng.IHttpPromise<number>;
        UpdateLocation(id: number, locationNumber: string, locationName: string): ng.IHttpPromise<{}>;
        MoveLocation(locationId: number, newParentId: number): ng.IHttpPromise<{}>;
        SetDisplayName(location: ILocation): void;
        GetLowestHiearchyLevel(): number;
    }

    export interface ILocation extends Api.Models.IHierarchyEntity {
        Parent: ILocation;
        Children: ILocation[];
        Viewable: boolean;
        DisplayName: string;
    }

    interface ISubscriptionHandler {
        Handler: (location: ILocation, levels: string[]) => any;
        Context?: any;
    }

    export class LocationService implements ILocationService {
        private LocationMap = [];
        private Subscribers: ISubscriptionHandler[] = [];
        private User: Core.Auth.IUser;
        private CurrentHierarchy: ng.IDeferred<ILocation>;
        private CurrentLevels: ng.IDeferred<string[]>;
        private CurrentLocationHierarchy: ILocation;
        private CurrentLocationLevels: string[];
        private CurrentLocationRequests: ng.IDeferred<void>[] = [];
        private IsProcessing: boolean;

        constructor(
            private $q: ng.IQService,
            private hierarchy: Api.IHierarchyService,
            auth: Core.Auth.IAuthService,
            private formatter: Core.IFormatterService) {

            this.User = auth.GetUser();
            this.LoadData();
        }

        public LoadData(): void {
            if (!this.IsProcessing) {
                this.GetHierarchy().then((location: ILocation): void => {
                    this.GetHierarchyLevels().then((levels: string[]): void => {
                        this.CurrentLocationHierarchy = location;
                        this.CurrentLocationLevels = levels;
                        this.Notify();
                        this.IsProcessing = false;

                        while (this.CurrentLocationRequests.length) {
                            this.CurrentLocationRequests.shift().resolve();
                        }
                    });
                });

                this.IsProcessing = true;
            }
        }

        public Subscribe(subscribingScope: ng.IScope, handler: (location: ILocation, levels: string[]) => any, context?: any): void {
            var subscription = <ISubscriptionHandler>{ Handler: handler, Context: context };
            this.Subscribers.push(subscription);

            subscribingScope.$on("$destroy", (): void => {
                this.Subscribers.splice(this.Subscribers.indexOf(subscription), 1);
            });

            if (this.CurrentLocationHierarchy && this.CurrentLocationLevels) {
                subscription.Handler.apply(subscription.Context, [this.CurrentLocationHierarchy, this.CurrentLocationLevels]);
            }
        }

        public GetLocationById(id: number): ng.IPromise<ILocation> {
            var deferred = this.$q.defer<void>(),
                returnedDeferred = this.$q.defer<ILocation>();

            deferred.promise.then((): void => {
                returnedDeferred.resolve(this.LocationMap[id]);
            });

            if (!this.IsProcessing && this.CurrentLocationHierarchy && this.CurrentLocationLevels) {
                deferred.resolve();
            } else {
                this.CurrentLocationRequests.push(deferred);
            }

            return returnedDeferred.promise;
        }

        public SortLocationChildren(location: ILocation): void {
            location.Children.sort((a: ILocation, b: ILocation): number => {
                if (a.Name < b.Name) {
                    return -1;
                }
                if (a.Name > b.Name) {
                    return 1;
                }
                return 0;
            });
        }

        public CreateNewLocationForParent(parentId: number, locationName: string, locationNumber: string): ng.IHttpPromise<number> {
            var parent = this.LocationMap[parentId];
            var locationType = parent.Type + 1;

            return this.hierarchy.PostCreateEntity(locationNumber, locationName, parentId, locationType).success((result: number): void => {
                var newLocation : ILocation = {
                    Id: result,
                    Name: locationName,
                    Number: locationNumber,
                    Type: locationType,
                    Children: [],
                    Parent: parent,
                    Status: "Active",
                    Viewable: true,
                    DisplayName: null
                };

                this.SetDisplayName(newLocation);

                parent.Children.push(newLocation);
                this.LocationMap[result] = newLocation;
                this.SortLocationChildren(parent);
            });
        }

        public UpdateLocation(id: number, locationNumber: string, locationName: string): ng.IHttpPromise<{}> {
            return this.hierarchy.PutUpdateBarebonesEntity(id, locationNumber, locationName).success((): void => {
                var location = this.LocationMap[id];

                location.Name = locationName;
                location.Number = locationNumber;

                this.SetDisplayName(location);

                if (location.Parent) {
                    this.SortLocationChildren(location.Parent);
                }
            });
        }

        public MoveLocation(locationId: number, newParentId: number): ng.IHttpPromise<{}> {
            return this.hierarchy.PutMoveHierarchy(locationId, newParentId).success((): void => {
                var location = this.LocationMap[locationId],
                    newParent = this.LocationMap[newParentId],
                    oldParent = location.Parent,
                    length = oldParent.Children.length,
                    i: number;

                for (i = 0; i < length; i += 1) {
                    if (oldParent.Children[i] === location) {
                        oldParent.Children.splice(i, 1);
                        newParent.Children.push(location);

                        location.Parent = newParent;
                        break;
                    }
                }

                this.SortLocationChildren(oldParent);
                this.SortLocationChildren(newParent);
            });
        }

        public SetDisplayName(location: ILocation): void {
            var entityModel = <Core.Api.Models.IEntityModel>{
                Id: location.Id,
                Name: location.Name,
                Number: location.Number
            };

            location.DisplayName = this.formatter.CreateLocationDisplayName(entityModel);
        }

        public GetLowestHiearchyLevel(): number {
            return this.CurrentLocationLevels.length;
        }

        private GetHierarchy(): ng.IPromise<ILocation> {
            if (this.CurrentHierarchy) {
                return this.CurrentHierarchy.promise;
            }

            this.CurrentHierarchy = this.$q.defer<ILocation>();

            this.hierarchy.GetHierarchy(1).success((result: Api.Models.IHierarchyEntity): void => {
                this.ProcessData(<ILocation>result);
                this.CurrentHierarchy.resolve(<ILocation>this.LocationMap[this.User.BusinessUser.EntityIdBase]);
                this.CurrentHierarchy = null;
            });

            return this.CurrentHierarchy.promise;
        }

        private GetHierarchyLevels(): ng.IPromise<string[]> {
            if (this.CurrentLevels) {
                return this.CurrentLevels.promise;
            }

            this.CurrentLevels = this.$q.defer<string[]>();

            this.hierarchy.GetHierarchyLevels().success((result: string[]): void => {
                this.CurrentLevels.resolve(result);
                this.CurrentLevels = null;
            });

            return this.CurrentLevels.promise;
        }

        private ProcessData(location: ILocation, parentLocation?: ILocation): ILocation {
            var children = location.Children,
                length = (children) ? children.length : 0,
                i;

            if (parentLocation) {
                location.Parent = parentLocation;
            }

            if (location.Id === this.User.BusinessUser.EntityIdBase) {
                location.Viewable = true;
            }

            if (!location.Viewable) {
                location.Viewable = (parentLocation && parentLocation.Viewable) ?
                parentLocation.Viewable :
                this.User.BusinessUser.AssignedLocations.indexOf(location.Id) > -1;
            }

            this.SetDisplayName(location);

            for (i = 0; i < length; i += 1) {
                this.ProcessData(<ILocation>children[i], location);
            }

            this.LocationMap[location.Id] = location;

            return location;
        }

        private Notify(): void {
            var length = this.Subscribers.length,
                subscription: ISubscriptionHandler,
                i: number;

            for (i = 0; i < length; i += 1) {
                subscription = this.Subscribers[i];
                subscription.Handler.apply(subscription.Context, [this.CurrentLocationHierarchy, this.CurrentLocationLevels]);
            }
        }
    }

    export var $locationService: Core.NG.INamedService<ILocationService> = Core.NG.AdministrationHierarchyModule.RegisterService("LocationService", LocationService,
        Core.NG.$q,
        Api.$hierarchyService,
        Core.Auth.$authService,
        Core.$formatterService
        );
} 