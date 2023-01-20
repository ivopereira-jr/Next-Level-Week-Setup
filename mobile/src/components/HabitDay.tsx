import clsx from 'clsx';
import dayjs from 'dayjs';
import {
	Dimensions,
	TouchableOpacity,
	TouchableOpacityProps
} from 'react-native';

import { generateProgressPercentage } from '../utils/gererate-progress-percentage';

const week_days = 7;
const screen_horizontal_padding = (32 * 2) / 5;

export const day_margin_between = 8;
export const day_size =
	Dimensions.get('screen').width / week_days - (screen_horizontal_padding + 5);

interface HabitDayProps extends TouchableOpacityProps {
	amountOfHabits?: number;
	amountCompleted?: number;
	date: Date;
}

export function HabitDay({
	amountOfHabits = 0,
	amountCompleted = 0,
	date,
	...rest
}: HabitDayProps) {
	const amountAccomplishedPercentage =
		amountOfHabits > 0
			? generateProgressPercentage(amountOfHabits, amountCompleted)
			: 0;
	const today = dayjs().startOf('day').toDate();
	const isCurrentDay = dayjs(date).isSame(today);

	return (
		<TouchableOpacity
			className={clsx('border-2 rounded-lg m-1', {
				' bg-zinc-900  border-zinc-800': amountAccomplishedPercentage === 0,
				'bg-violet-900 border-violet-700':
					amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
				'bg-violet-800 border-violet-600':
					amountAccomplishedPercentage >= 20 &&
					amountAccomplishedPercentage < 40,
				'bg-violet-700 border-violet-500':
					amountAccomplishedPercentage >= 40 &&
					amountAccomplishedPercentage < 60,
				'bg-violet-600 border-violet-500':
					amountAccomplishedPercentage >= 60 &&
					amountAccomplishedPercentage < 80,
				'bg-violet-500 border-violet-400': amountAccomplishedPercentage >= 80,
				'border-white borrder-3': isCurrentDay
			})}
			style={{ width: day_size, height: day_size }}
			activeOpacity={0.7}
			{...rest}
		/>
	);
}
