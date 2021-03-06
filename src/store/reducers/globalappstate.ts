import { combineReducers, Reducer } from "redux";
import { Pokemon } from "../../models";
import {
    AppNotificationAction,
    AuthenticationAction,
    AuthenticationActionType,
    EvolutionAction,
    EvolutionActionType,
    NotificationActionType,
    PokemonAction,
    PokemonActionType,
    StoragePageAction,
    StoragePageActionType,
    WebSocketAction,
    WebSocketActionType
} from "../actions/types";

import {
    AuthenticationState,
    EvolutionState,
    EvolutionStatus,
    GlobalAppState,
    LeaderboardState,
    Notifications
} from "../types";

const authenticationReducer: Reducer<AuthenticationState, AuthenticationAction> = (state = {token: null}, action) => {
    switch(action.type) {
        case AuthenticationActionType.TOKEN_RETRIEVED:
            return {token: action.token};
        case AuthenticationActionType.TOKEN_DESTROY:
            return {token: null};
    }
    return {...state};
};


const errorNotificationReducer: Reducer<Notifications, AppNotificationAction> = (notifications = [], action) => {
    switch(action.type) {
        case NotificationActionType.NOTIFY:
            return ([] as Notifications).concat(notifications, {...action.notification});
        case NotificationActionType.WITHDRAW:
            return notifications.filter((n) => n.id !== action.notification.id);
    }
    return Array.from(notifications);
};

const openSocketsReducer: Reducer<string[], WebSocketAction> = (openSockets = [], action) => {
    switch(action.type) {
        case WebSocketActionType.OPEN:
            return openSockets.concat([action.name]);
        case WebSocketActionType.CLOSED:
            return openSockets.filter((socket) => socket !== action.name);
    }
    return [...openSockets];
};


const showcaseReducer: Reducer<Array<[Pokemon, number]>, PokemonAction> = (pokemon = [], action) => {
    switch(action.type) {
        case PokemonActionType.SHOWCASE:
            return [...pokemon, [action.pokemon, action.packId]];

        case PokemonActionType.UNSHOWCASE:
            return pokemon.filter(([pkmn]) => pkmn.id !== action.pokemon.id);
    }

    return pokemon;
};

const pokemonStoragePageReducer: Reducer<number, StoragePageAction> = (state = 0, action) => {
    switch(action.type) {
        case StoragePageActionType.INCR:
            return state + 1;
        case StoragePageActionType.DECR:
            return Math.max(0, state - 1);
        case StoragePageActionType.SET:
            return action.page;
    }
    return state;
};

const evolutionReducer: Reducer<EvolutionState, EvolutionAction> = (state = {status: EvolutionStatus.NONE}, action) => {
    switch(action.type) {
        case EvolutionActionType.INITIATE:
            if(state.status !== EvolutionStatus.EVOLVING) {
                return {
                    status: EvolutionStatus.EVOLVING,
                    data: {
                        pokemonOrigin: action.pokemonOrigin,
                        pokemonEvolution: action.pokemonEvolution,
                        evolutionStartTimestamp: Date.now()
                    }
                };
            }
            break;

        case EvolutionActionType.LOCK:
            return {status: EvolutionStatus.PENDING};

        case EvolutionActionType.DONE:
            return {status: EvolutionStatus.NONE};
    }
    return {...state};
};

const leaderboardReducer: Reducer<LeaderboardState, WebSocketAction> = (state = [], action) => {
    switch(action.type) {
        case WebSocketActionType.RECEIVE:
            const match = action.message.match(/^leaderboard:(.*)$/);
            if(match) {
                const leaderboard = JSON.parse(match[1]) as {[name: string]: number};
                const leaderboardState: LeaderboardState = Object.entries(leaderboard)
                    .map(([k, v]) => ({name: k, pokeDollars: v}));
                return leaderboardState;
            }
    }

    return [...state];
};

export default combineReducers({
    leaderboard: leaderboardReducer,
    authentication: authenticationReducer,
    notifications: errorNotificationReducer,
    openSockets: openSocketsReducer,
    showcase: showcaseReducer,
    pokemonStoragePage: pokemonStoragePageReducer,
    evolutionState: evolutionReducer,
}) as Reducer<GlobalAppState>;
