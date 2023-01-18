import { View, Text, ScrollView } from 'react-native';

import { day_size, HabitDay } from '../components/HabitDay';
import { Header } from '../components/Header';
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDateSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDateSizes - datesFromYearStart.length;

export function Home() {
	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<Header />

			<View className="flex-row mt-6 mb-2">
				{weekDays.map((weekDay, index) => (
					<Text
						key={`${weekDay}-${index}`}
						className="text-zinc-400 text-xl font-bold text-center mx-1"
						style={{ width: day_size }}
					>
						{weekDay}
					</Text>
				))}
			</View>

			<ScrollView
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="flex-row flex-wrap">
					{datesFromYearStart.map(date => (
						<HabitDay key={date.toString()} />
					))}

					{amountOfDaysToFill > 0 &&
						Array.from({ length: amountOfDaysToFill }).map((_, index) => (
							<View
								key={index}
								className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
								style={{ width: day_size, height: day_size }}
							/>
						))}
				</View>
			</ScrollView>
		</View>
	);
}