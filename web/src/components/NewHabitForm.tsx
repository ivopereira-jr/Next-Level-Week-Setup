import { FormEvent, useState } from 'react';
import { Check } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { api } from '../lib/axios';

const availableWeekDays = [
	'Domingo',
	'Segunda-feira',
	'Terça-feira',
	'Quarta-feira',
	'Quinta-feira',
	'Sexta-feira',
	'Sábado'
];

export function NewHabitForm() {
	const [title, setTitle] = useState('');
	const [weekDays, setWeekDays] = useState<number[]>([]);

	async function createNewHabit(event: FormEvent) {
		event.preventDefault();

		if (!title || weekDays.length === 0) {
			return;
		}

		await api.post('habits', {
			title,
			weekDays
		});

		setTitle('');
		setWeekDays([]);

		alert('Habito criado com sucesso!');
	}

	function handleToggleWeekday(weekDay: number) {
		if (weekDays.includes(weekDay)) {
			const weekDayWithRemovedOne = weekDays.filter(day => day !== weekDay);

			setWeekDays(weekDayWithRemovedOne);
		} else {
			const weekDaysWithAddedOne = [...weekDays, weekDay];

			setWeekDays(weekDaysWithAddedOne);
		}
	}

	return (
		<form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
			<label className="font-semibold leading-tight">
				<input
					type="text"
					placeholder="ex. Exercicions, dormir bem, etc..."
					className="w-full p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
					value={title}
					onChange={event => setTitle(event.target.value)}
				/>
			</label>

			<label className="font-semibold leading-tight mt-4">
				Qual a recorrência
			</label>

			<div className="mt-3 flex flex-col gap-2">
				{availableWeekDays.map((weekDay, index) => {
					return (
						<Checkbox.Root
							key={weekDay}
							className="flex items-center gap-3 group focus:outline-none"
							checked={weekDays.includes(index)}
							onCheckedChange={() => handleToggleWeekday(index)}
						>
							<div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500  group-data-[state=checked]:border-green-500 transition-colors ease-linear duration-200 group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900">
								<Checkbox.Indicator>
									<Check size={20} className="text-white" />
								</Checkbox.Indicator>
							</div>

							<span className=" text-white leading-tight">{weekDay}</span>
						</Checkbox.Root>
					);
				})}
			</div>

			<button
				type="submit"
				className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors ease-linear duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
			>
				<Check size={20} weight="bold" />
			</button>
		</form>
	);
}
