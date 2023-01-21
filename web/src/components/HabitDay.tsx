import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import dayjs from 'dayjs';

import { ProgressBar } from './ProgressBar';
import { HabitsList } from './HabitsList';

interface HabitProps {
	date: Date;
	amount?: number;
	defaultCompleted?: number;
}

export function HabitDay({
	amount = 0,
	defaultCompleted = 0,
	date
}: HabitProps) {
	const [completed, setCompleted] = useState(defaultCompleted);

	const completedPercentage =
		amount > 0 ? Math.round((completed / amount) * 100) : 0;

	const dayAndMonth = dayjs(date).format('DD/MM');
	const dayOfWeek = dayjs(date).format('dddd');

	function handleCompletedChanged(habitCompleted: number) {
		setCompleted(habitCompleted);
	}

	return (
		<Popover.Root>
			<Popover.Trigger
				className={clsx(
					'w-10 h-10 border-2 rounded-lg transition-colors ease-linear duration-200 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background',
					{
						' bg-zinc-900  border-zinc-800': completedPercentage === 0,
						'bg-violet-900 border-violet-700':
							completedPercentage > 0 && completedPercentage < 20,
						'bg-violet-800 border-violet-600':
							completedPercentage >= 20 && completedPercentage < 40,
						'bg-violet-700 border-violet-500':
							completedPercentage >= 40 && completedPercentage < 60,
						'bg-violet-600 border-violet-500':
							completedPercentage >= 60 && completedPercentage < 80,
						'bg-violet-500 border-violet-400': completedPercentage >= 80
					}
				)}
			/>
			<Popover.Portal>
				<Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
					<Popover.Arrow width={16} height={8} className="fill-zinc-900" />

					<span className="font-semibold text-zinc-400">{dayOfWeek}</span>
					<span className="mt-1 font-extrabold leading-tight text-3xl">
						{dayAndMonth}
					</span>

					<ProgressBar progress={completedPercentage} />

					<HabitsList date={date} onCompletedChanged={handleCompletedChanged} />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

/*
	 o group no tailwind serve para vc conseguir pegar os atributos do componente e com isso fazer uso desses atributos 
	 em outros elementos no caso aqui a div por volta do checkboc.indicator vai ter um background diferente se caso 
	 o checkbox tiver como checked mais essa atributo de ckecked so esta no checkbox.root intao com o group da para ter 
	 acesso com outros elementos
*/
