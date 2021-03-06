import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppNotification, Boosterpack, Item, Pokemon } from '../../models';
import { User } from "../../models/user";
import { State } from '../types';


export enum NotificationActionType {
    NOTIFY = "NOTIFICATION_NOTIFY",
    WITHDRAW = "NOTIFICATION_WITHDRAW",
}

export type AppNotificationAction = {
    type: NotificationActionType.NOTIFY;
    notification: AppNotification;
} | {
    type: NotificationActionType.WITHDRAW;
    notification: AppNotification;
};

export enum AuthenticationActionType {
    TOKEN_RETRIEVED = "AUTHENTICATION_TOKEN_RETRIEVED",
    TOKEN_DESTROY = "AUTHENTICATION_TOKEN_DESTROY"
}

export type AuthenticationAction = {
    type: AuthenticationActionType.TOKEN_RETRIEVED;
    token: string;
} | {
    type: AuthenticationActionType.TOKEN_DESTROY;
};


export enum StoragePageActionType {
    INCR = "STORAGE_PAGE_INCR",
    DECR = "STORAGE_PAGE_DECR",
    SET = "STORAGE_PAGE_SET"
}

export type StoragePageAction = {
    type: StoragePageActionType.INCR | StoragePageActionType.DECR;
} | {
    type: StoragePageActionType.SET;
    page: number
};

export enum EvolutionActionType {
    INITIATE = "EVOLUTION_INITIATE",
    DONE = "EVOUTION_DONE",
    LOCK = "EVOLUTION_LOCK",
}

export type EvolutionAction = {
    type: EvolutionActionType.INITIATE;
    pokemonOrigin: Pokemon;
    pokemonEvolution: Pokemon;
} | {
    type: EvolutionActionType.DONE | EvolutionActionType.LOCK;
};

export enum UserActionType {
    SET = 'USER_SET',
    UNSET = 'USER_UNSET'
}


export type UserAction = {
    type: UserActionType.SET;
    user: User;
} | {
    type: UserActionType.UNSET;
};


export enum PokemonActionType {
    ADD_OR_UPDATE = 'POKEMON_ADD_OR_UPDATE',
    SET_ALL = 'POKEMON_SET_ALL',
    CLEAR_ALL = 'POKEMON_CLEAR_ALL',
    SHOWCASE = "POKEMON_SHOWCASE",
    UNSHOWCASE = "POKEMON_UNSHOWCASE",
    DELETE = "POKEMON_DELETE"
}


export type PokemonAction = {
    type: PokemonActionType.ADD_OR_UPDATE;
    pokemon: Pokemon;
} | {
    type: PokemonActionType.SET_ALL;
    pokemons: Pokemon[];
} | {
    type: PokemonActionType.DELETE;
    pokemons: Pokemon[];
} | {
    type: PokemonActionType.CLEAR_ALL;
} | {
    type: PokemonActionType.SHOWCASE;
    pokemon: Pokemon;
    packId: number;
} | {
    type: PokemonActionType.UNSHOWCASE;
    pokemon: Pokemon;
};


export enum ItemActionType {
    ADD_OR_UPDATE = 'ITEM_ADD_OR_UPDATE',
    CLEAR_ALL = 'ITEM_CLEAR_ALL'
}


export type ItemAction = {
    type: ItemActionType.ADD_OR_UPDATE;
    item: Item;
} | {
    type: ItemActionType.CLEAR_ALL;
};


export enum BoosterpackActionType {
    ADD_OR_UPDATE = 'BOOSTERPACK_ADD_OR_UPDATE',
    CLEAR_ALL = 'BOOSTERPACK_CLEAR_ALL',
}

export enum WebSocketActionType {
    OPEN = 'WEBSOCKET_OPEN',
    SEND = 'WEBSOCKET_SEND',
    CLOSE = 'WEBSOCKET_CLOSE',

    RECEIVE = 'WEBSOCKET_RECEIVE',
    CLOSING = 'WEBSOCKET_CLOSING',
    CLOSED = 'WEBSOCKET_CLOSED'
}

export type WebSocketName = "clicking" | "balance";

export type BoosterpackAction = {
    type: BoosterpackActionType.ADD_OR_UPDATE;
    boosterpack: Boosterpack;
} | {
    type: BoosterpackActionType.CLEAR_ALL;
};

export type WebSocketAction = {
    type: WebSocketActionType.OPEN;
    name: WebSocketName;
    endpoint: string;
    token: string;
} | {
    type: WebSocketActionType.SEND;
    name: WebSocketName;
    message: string;
} | {
    type: WebSocketActionType.CLOSE;
    name: WebSocketName;
} | {
    type: WebSocketActionType.RECEIVE;
    name: WebSocketName;
    message: string;
    event: MessageEvent;
} | {
    type: WebSocketActionType.CLOSING;
    name: WebSocketName;
    event: CloseEvent;
} | {
    type: WebSocketActionType.CLOSED;
    name: WebSocketName;
    event: CloseEvent;
};

type ThunkActionBase<A extends AnyAction> = ThunkAction<void, State, void, A>;

export type BoosterpackThunk = ThunkActionBase<BoosterpackAction>;
export type ItemThunk = ThunkActionBase<ItemAction>;
export type UserThunk = ThunkActionBase<UserAction>;
export type PokemonThunk = ThunkActionBase<PokemonAction>;
export type WebSocketThunk = ThunkActionBase<WebSocketAction>;
