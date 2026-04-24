"use client";

import EventEmitter from "eventemitter3";
import { useEffect, useRef, useState } from "react";
import { RequireAtLeastOne } from "type-fest";

type EmitHandler<T extends Record<string, any>> = <E extends keyof T>(
  event: E,
  payload: T[E],
) => void;
type OnHandler<T extends Record<string, any>> = <E extends keyof T>(
  event: E,
  handler: (payload: T[E]) => void,
) => () => any;

type UseListenerHook<T extends Record<string, any>> = <E extends keyof T>(
  params: {
    event: E;
  } & RequireAtLeastOne<{
    handler?: (payload: T[E]) => void;
    rerenderOnTrigger?: boolean;
  }>,
) => number;

export interface Events<T extends Record<string, any>> {
  on: OnHandler<T>;
  emit: EmitHandler<T>;
  useListener: UseListenerHook<T>;
}

export const createEvents = <T extends Record<string, any>>() => {
  const emitter = new EventEmitter();
  const on: OnHandler<T> = (event, handler) => {
    emitter.addListener(event as string, handler);
    return () => {
      emitter.removeListener(event as string, handler);
    };
  };

  const emit: EmitHandler<T> = (e, payload) => {
    emitter.emit(e as string, payload);
  };

  const useListener: UseListenerHook<T> = ({
    event,
    handler,
    rerenderOnTrigger,
  }) => {
    const [counter, setCounter] = useState(0);

    const handlerRef = useRef(handler);

    // this is needed otherwise we get an infinite loop
    // otherwise you'd have to pass a memoized callback every time
    // this removes the necessity
    useEffect(() => {
      handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
      return on(event, (payload) => {
        if (rerenderOnTrigger) {
          setCounter((c) => c + 1);
        }
        if (handlerRef.current) handlerRef.current(payload);
      });
    }, [event, rerenderOnTrigger]);

    return counter;
  };

  const events: Events<T> = {
    on,
    emit,
    useListener,
  };

  return events;
};
