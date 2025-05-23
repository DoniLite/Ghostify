// deno-lint-ignore-file no-explicit-any
// hono-store.ts
import { useSyncExternalStore } from 'npm:hono/jsx/dom';

type Listener = () => void;
type Selector<T, Selected> = (state: T) => Selected;
type SetState<T> = (partial: T | ((state: T) => T)) => void;
type ActionHandler<T, Args extends unknown[]> = (
  getState: () => T,
  setState: SetState<T>,
  ...args: Args
) => void;

interface Store<T> {
  getState: () => T;
  setState: SetState<T>;
  subscribe: (listener: Listener) => () => void;
  useStore: <Selected>(selector: Selector<T, Selected>) => Selected;
  createAction: <Args extends unknown[]>(
    handler: ActionHandler<T, Args>
  ) => (...args: Args) => void;
}

export function createStore<T extends Record<string, unknown>>(
  initialState: T
): Store<T> {
  // État interne du store
  let state: T = { ...initialState };

  // Ensemble des listeners pour les notifications de changements
  const listeners = new Set<Listener>();

  // Fonction pour obtenir l'état actuel
  const getState = (): T => state;

  // Fonction pour mettre à jour l'état
  const setState: SetState<T> = (partial) => {
    const nextState =
      typeof partial === 'function'
        ? (partial as (state: T) => T)(state)
        : partial;

    // Mise à jour de l'état seulement s'il y a un changement
    state = { ...state, ...nextState };

    // Notification de tous les listeners
    listeners.forEach((listener) => listener());
  };

  // Gestion des abonnements
  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  // Hook pour utiliser le store dans les composants
  const useStore = <Selected>(selector: Selector<T, Selected>): Selected => {
    // Utilisation de useSyncExternalStore pour synchroniser avec le store externe
    return useSyncExternalStore(
      subscribe, // Fonction d'abonnement
      () => selector(getState()), // Sélecteur pour l'état client
      () => selector(getState()) // Sélecteur pour l'état serveur (SSR)
    );
  };

  // Création d'actions pour manipuler l'état
  const createAction = <Args extends unknown[]>(
    handler: ActionHandler<T, Args>
  ) => {
    return (...args: Args): void => {
      handler(getState, setState, ...args);
    };
  };

  // Persistance locale si disponible (côté client uniquement)
  const tryLoadFromStorage = () => {
    try {
      if (typeof window !== 'undefined' && globalThis.localStorage) {
        const key = `hono-store-${Object.keys(initialState).join('-')}`;
        const storedState = localStorage.getItem(key);

        if (storedState) {
          const parsedState = JSON.parse(storedState);
          state = { ...state, ...parsedState };
        }

        // Observer les changements et les persister
        subscribe(() => {
          localStorage.setItem(key, JSON.stringify(state));
        });
      }
    } catch (error) {
      console.error('Failed to load/save state from localStorage:', error);
    }
  };

  // Tenter de charger l'état depuis le stockage local
  tryLoadFromStorage();

  return {
    getState,
    setState,
    subscribe,
    useStore,
    createAction,
  };
}

// Utility functions
export function combineStores<T extends Record<string, Store<any>>>(stores: T) {
  type CombinedState = {
    [K in keyof T]: T[K] extends Store<infer S> ? S : never;
  };

  return {
    useStore: <Selected>(
      selector: Selector<CombinedState, Selected>
    ): Selected => {
      // Créer un objet combiné des états
      const getCombinedState = (): CombinedState => {
        const combinedState = {} as CombinedState;

        for (const key in stores) {
          combinedState[key] = stores[key].getState();
        }

        return combinedState;
      };

      // S'abonner à tous les stores
      return useSyncExternalStore(
        (callback) => {
          // Créer un abonnement pour chaque store
          const unsubscribes = Object.values(stores).map((store) =>
            store.subscribe(callback)
          );

          // Fonction de désabonnement
          return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
        },
        () => selector(getCombinedState()),
        () => selector(getCombinedState())
      );
    },
  };
}

// Fonction d'aide pour créer un store avec des actions prédéfinies
export function createStoreWithActions<
  T extends Record<string, unknown>,
  A extends Record<string, ActionHandler<T, unknown[]>>
>(initialState: T, actions: A) {
  const store = createStore(initialState);

  const boundActions = {} as {
    [K in keyof A]: ActionHandler<T, unknown[]>;
  };

  for (const key in actions) {
    boundActions[key] = store.createAction(actions[key]);
  }

  return {
    ...store,
    actions: boundActions,
  };
}
