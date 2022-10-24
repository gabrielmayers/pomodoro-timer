import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { createContext, useContext, useEffect, useState } from "react";
import * as zod from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { Countdown } from "./components/Countdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewCycleForm } from "./components/NewCycleForm";
import { CyclesContext } from "../../contexts/CyclesContext";

interface NewCycleFormData {
    task: string;
    minutesAmount: number;
}


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, 'O ciclo precisa ser no mínimo de 5 minutos').
        max(240, 'O ciclo precisa ser no máximo de 240 minutos')
});

export function Home() {

    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    const task = watch('task'); // watch the field task
    const isSubmitDisabled = !task;

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data);
        reset();
    }

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="submit">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}

            </form>
        </HomeContainer>
    );
}