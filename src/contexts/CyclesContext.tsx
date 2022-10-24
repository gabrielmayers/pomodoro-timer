import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;  
    createNewCycle: (data: CreateNewCycleData) => void;
    interruptCurrentCycle: () => void;
}

interface CreateNewCycleData {
    task: string;
    minutesAmount: number;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode;
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer,

        {
        cycles: [],
        activeCycleId: null
    }, () => {
        const storedStateAsJSON = localStorage.getItem('@ignite-time:cycles-state-1.0.0');

        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON);
        }

        return {
            cycles: [],
            activeCycleId: null
        }
    });

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);

    const [amountSecondsPassed, setAmountsSecondsPassed] = useState(() => {
        if (activeCycle) {
            differenceInSeconds(new Date(), new Date(activeCycle.startDate));
        }

        return 0;
    });

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);
        localStorage.setItem('@ignite-time:cycles-state-1.0.0', stateJSON);
    }, [cyclesState]);

    function setSecondsPassed(seconds: number) {
        setAmountsSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {

        dispatch(markCurrentCycleAsFinished());
    }

    function createNewCycle(data: CreateNewCycleData) {
        const cycleId = String(new Date().getTime());

        const newCycle: Cycle = {
            id: cycleId,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch(addNewCycleAction(newCycle));

        setAmountsSecondsPassed(0);
    }

    function interruptCurrentCycle() {

        dispatch(interruptCurrentCycleAction());
    } 

    return (
        <CyclesContext.Provider 
            value={{ 
                cycles,
                activeCycle, 
                activeCycleId, 
                markCurrentCycleAsFinished, 
                amountSecondsPassed, 
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
                }}
            >
            {children}
            </CyclesContext.Provider>
    );
}